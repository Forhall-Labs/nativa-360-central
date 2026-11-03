/**
 * Computes the PR score in CI, publishes it (job summary and one PR comment
 * that is updated in place) and exits non-zero below the threshold, so the
 * required "PR score" check blocks the merge.
 *
 * The score is given only once every other required check has passed on the
 * same commit: the jobs of ci.yml this one needs (NEEDS, the workflow's
 * `toJSON(needs)`) and the external checks in REQUIRED_CHECKS (one per line,
 * e.g. SonarCloud Code Analysis). If one fails or never finishes, the score
 * is withheld and this check fails too.
 *
 * Inputs (environment): BASE_SHA, HEAD_SHA, PR_NUMBER, SONAR_PROJECT_KEY,
 * NEEDS, REQUIRED_CHECKS, GITHUB_REPOSITORY, GITHUB_TOKEN; optional
 * CHECKS_WAIT_MINUTES (default 45), SONAR_WAIT_MINUTES (default 20) and
 * COVERAGE_DIR (default coverage-reports) and SNYK_DIR (default
 * snyk-reports: the JSON/SARIF reports of the Snyk jobs, for the breakdown).
 * Coverage comes from the coverage-<project> artifacts of ci.yml's matrix,
 * downloaded under COVERAGE_DIR (one lcov.info per project folder).
 */
import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import {
  COMMENT_MARKER,
  changedLineCoverage,
  changedLines,
  checksState,
  computeScore,
  parseLcov,
  renderPending,
  renderReport,
  renderWithheld,
} from "./score.mjs";
import {
  buildBreakdown,
  normalizeHotspots,
  normalizeSonarIssues,
  parseSnykJson,
  parseSnykSarif,
  renderBreakdown,
} from "./breakdown.mjs";

const env = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const SONAR = "https://sonarcloud.io/api";
const METRICS = [
  "new_security_rating",
  "new_reliability_rating",
  "new_maintainability_rating",
  "new_duplicated_lines_density",
  "new_security_hotspots_reviewed",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.json();
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
    Accept: "application/vnd.github+json",
  };
}

/**
 * Waits for the other required checks on this commit. Returns the failed
 * ones (empty when all passed); a check still running at the deadline counts
 * as failed, so the score is never given without them.
 */
async function waitForChecks(repo, sha, required, minutes, onFirstWait) {
  const deadline = Date.now() + minutes * 60_000;
  const api = `https://api.github.com/repos/${repo}/commits/${sha}`;
  for (;;) {
    const { check_runs } = await getJson(`${api}/check-runs?per_page=100`, {
      headers: githubHeaders(),
    });
    const statuses = await getJson(`${api}/statuses?per_page=100`, {
      headers: githubHeaders(),
    });
    const { pending, failed } = checksState(required, check_runs, statuses);
    if (failed.length > 0) return failed;
    if (pending.length === 0) return [];
    if (Date.now() > deadline) {
      return pending.map(
        (name) => `${name} (no terminó en ${minutes} minutos)`,
      );
    }
    if (onFirstWait) {
      await onFirstWait(pending);
      onFirstWait = null;
    }
    console.log(`Waiting for: ${pending.join(", ")}`);
    await sleep(30_000);
  }
}

/** Waits until SonarQube Cloud has analysed this exact commit of the PR. */
async function waitForSonar(project, pr, sha, minutes) {
  const deadline = Date.now() + minutes * 60_000;
  for (;;) {
    const { pullRequests } = await getJson(
      `${SONAR}/project_pull_requests/list?project=${encodeURIComponent(project)}`,
    );
    const analysed = pullRequests.find((p) => p.key === pr);
    if (analysed?.commit?.sha === sha) return;
    if (Date.now() > deadline) {
      throw new Error(
        `SonarQube Cloud did not analyse ${sha.slice(0, 7)} within ${minutes} minutes`,
      );
    }
    await sleep(20_000);
  }
}

async function sonarMeasures(project, pr) {
  const { component } = await getJson(
    `${SONAR}/measures/component?component=${encodeURIComponent(project)}` +
      `&pullRequest=${pr}&metricKeys=${METRICS.join(",")}`,
  );
  const measures = {};
  for (const m of component.measures) {
    const value = m.periods?.[0]?.value ?? m.period?.value ?? m.value;
    if (value !== undefined) measures[m.metric] = value;
  }
  return measures;
}

/** Optional measures for the breakdown: a missing one only leaves a gap. */
const EXTRA_METRICS = [
  "new_technical_debt",
  "new_sqale_debt_ratio",
  "new_lines",
];

async function sonarExtraMeasures(project, pr) {
  try {
    const { component } = await getJson(
      `${SONAR}/measures/component?component=${encodeURIComponent(project)}` +
        `&pullRequest=${pr}&metricKeys=${EXTRA_METRICS.join(",")}`,
    );
    const measures = {};
    for (const m of component.measures) {
      const value = m.periods?.[0]?.value ?? m.period?.value ?? m.value;
      if (value !== undefined) measures[m.metric] = value;
    }
    return measures;
  } catch (error) {
    console.log(`::warning::Sin métricas extra de Sonar: ${error.message}`);
    return {};
  }
}

/** Every open issue of the PR (paged), or null if Sonar does not answer. */
async function sonarIssues(project, pr) {
  try {
    const issues = [];
    for (let page = 1; page <= 10; page++) {
      const data = await getJson(
        `${SONAR}/issues/search?componentKeys=${encodeURIComponent(project)}` +
          `&pullRequest=${pr}&resolved=false&ps=500&p=${page}`,
      );
      issues.push(...data.issues);
      if (issues.length >= (data.paging?.total ?? data.total ?? 0)) break;
    }
    return normalizeSonarIssues(issues, project);
  } catch (error) {
    console.log(
      `::warning::No se pudieron leer los issues de Sonar: ${error.message}`,
    );
    return null;
  }
}

async function sonarHotspots(project, pr) {
  try {
    const { hotspots } = await getJson(
      `${SONAR}/hotspots/search?projectKey=${encodeURIComponent(project)}` +
        `&pullRequest=${pr}&status=TO_REVIEW&ps=500`,
    );
    return normalizeHotspots(hotspots, project);
  } catch (error) {
    console.log(
      `::warning::No se pudieron leer los hotspots de Sonar: ${error.message}`,
    );
    return null;
  }
}

/** Findings from the Snyk reports the Snyk jobs uploaded (if any). */
function snykFindings() {
  const dir = process.env.SNYK_DIR ?? "snyk-reports";
  if (!existsSync(dir)) return [];
  const findings = [];
  for (const file of readdirSync(dir, { recursive: true })) {
    const path = `${dir}/${file}`;
    try {
      if (String(file).endsWith("snyk-code.sarif")) {
        findings.push(...parseSnykSarif(readFileSync(path, "utf8")));
      } else if (String(file).endsWith("snyk-dependencies.json")) {
        findings.push(
          ...parseSnykJson(readFileSync(path, "utf8"), "dependencies"),
        );
      } else if (String(file).endsWith("snyk-container.json")) {
        findings.push(
          ...parseSnykJson(readFileSync(path, "utf8"), "container"),
        );
      }
    } catch (error) {
      console.log(
        `::warning::Reporte de Snyk ilegible (${file}): ${error.message}`,
      );
    }
  }
  return findings;
}

/** LCOV per project: COVERAGE_DIR/coverage-<project>/lcov.info covers <project>/. */
function coverageReports() {
  const coverage = new Map();
  const dir = process.env.COVERAGE_DIR ?? "coverage-reports";
  if (!existsSync(dir)) return coverage;
  for (const name of readdirSync(dir)) {
    const project = name.replace(/^coverage-/, "");
    const report = `${dir}/${name}/lcov.info`;
    if (!existsSync(report)) continue;
    for (const [file, hits] of parseLcov(
      readFileSync(report, "utf8"),
      project,
    )) {
      coverage.set(file, hits);
    }
  }
  return coverage;
}

/** Creates the score comment, or updates the one this job left before. */
async function publishComment(body) {
  const repo = env("GITHUB_REPOSITORY");
  const pr = env("PR_NUMBER");
  const headers = githubHeaders();
  const comments = await getJson(
    `https://api.github.com/repos/${repo}/issues/${pr}/comments?per_page=100`,
    { headers },
  );
  const previous = comments.find((c) => c.body?.startsWith(COMMENT_MARKER));
  const url = previous
    ? `https://api.github.com/repos/${repo}/issues/comments/${previous.id}`
    : `https://api.github.com/repos/${repo}/issues/${pr}/comments`;
  await getJson(url, {
    method: previous ? "PATCH" : "POST",
    headers,
    body: JSON.stringify({ body }),
  });
}

// Without it there is no score, but the breakdown of Snyk and coverage is
// still published so the PR knows what to improve.
const project = process.env.SONAR_PROJECT_KEY || null;
const pr = env("PR_NUMBER");
const head = env("HEAD_SHA");

// An absolute path: git is never looked up through an inherited PATH. It is
// /usr/bin/git on the GitHub runners (and on macOS).
const diff = execFileSync(
  "/usr/bin/git",
  ["diff", "--unified=0", "--no-color", `${env("BASE_SHA")}...${head}`],
  { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
);
const coverage = changedLineCoverage(changedLines(diff), coverageReports());

const required = env("REQUIRED_CHECKS")
  .split("\n")
  .map((name) => name.trim())
  .filter(Boolean);
const context = {
  sha: head,
  runUrl: process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null,
};

/** Publishing never decides the check: a missing comment is only a warning. */
async function tryPublish(body) {
  try {
    await publishComment(body);
  } catch (error) {
    console.log(
      `::warning::Could not publish the PR score comment: ${error.message}`,
    );
  }
}

// The ci.yml jobs this one needs have already finished: a skipped job (no
// project changed, Snyk disabled) is not a failure.
const needs = JSON.parse(process.env.NEEDS ?? "{}");
const failedJobs = Object.entries(needs)
  .filter(([, job]) => !["success", "skipped"].includes(job.result))
  .map(([name, job]) => `${name} (${job.result})`);
if (!project) {
  failedJobs.push("SonarQube Cloud (falta la variable SONAR_PROJECT_KEY)");
}
const snyk = { result: needs.snyk?.result ?? null, findings: snykFindings() };

const failed =
  failedJobs.length > 0
    ? failedJobs
    : await waitForChecks(
        env("GITHUB_REPOSITORY"),
        head,
        required,
        Number(process.env.CHECKS_WAIT_MINUTES ?? 45),
        (pending) => tryPublish(renderPending(context, pending)),
      );

let result = null;
let report;
if (failed.length > 0) {
  report = renderWithheld(
    failed,
    context,
    renderBreakdown(buildBreakdown({ sonar: null, snyk, coverage })),
  );
} else {
  await waitForSonar(
    project,
    pr,
    head,
    Number(process.env.SONAR_WAIT_MINUTES ?? 20),
  );
  const measures = await sonarMeasures(project, pr);
  result = computeScore(measures, coverage);
  const [extra, issues, hotspots] = await Promise.all([
    sonarExtraMeasures(project, pr),
    sonarIssues(project, pr),
    sonarHotspots(project, pr),
  ]);
  const sonarUrl =
    `https://sonarcloud.io/summary/new_code?id=${encodeURIComponent(project)}` +
    `&pullRequest=${pr}`;
  report = renderReport(
    result,
    context,
    renderBreakdown(
      buildBreakdown({
        sonar: { measures, extra, issues, hotspots },
        snyk,
        coverage,
      }),
      sonarUrl,
    ),
  );
}

console.log(report);
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
await tryPublish(report);

if (!result) {
  console.log(
    `::error::No score: required checks did not pass (${failed.join(", ")}).`,
  );
  process.exit(1);
}
if (!result.passed) {
  console.log(`::error::PR score ${result.score} is below the minimum.`);
  process.exit(1);
}
