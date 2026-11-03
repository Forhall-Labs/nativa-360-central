import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAX_ITEMS,
  buildBreakdown,
  formatMinutes,
  lineRanges,
  normalizeHotspots,
  normalizeSonarIssues,
  parseEffort,
  parseSnykJson,
  parseSnykSarif,
  renderBreakdown,
} from "./breakdown.mjs";

const KEY = "forhall_nativa";
const NO_COVERAGE = {
  total: 0,
  covered: 0,
  percent: null,
  uncovered: new Map(),
};
const PERFECT = {
  new_security_rating: "1.0",
  new_reliability_rating: "1.0",
  new_maintainability_rating: "1.0",
  new_duplicated_lines_density: "0.0",
};

const issue = (over) => ({
  key: "k",
  rule: "typescript:S1234",
  severity: "MAJOR",
  component: `${KEY}:admin/src/a.ts`,
  line: 7,
  message: "Mensaje",
  effort: "10min",
  type: "CODE_SMELL",
  ...over,
});

const section = (sections, title) =>
  sections.find((s) => s.title.includes(title));

test("effort strings become minutes and minutes read back", () => {
  assert.equal(parseEffort("1h30min"), 90);
  assert.equal(parseEffort("2d"), 960);
  assert.equal(parseEffort(undefined), 0);
  assert.equal(formatMinutes(45), "45 min");
  assert.equal(formatMinutes(120), "2 h");
  assert.equal(formatMinutes(135), "2 h 15 min");
});

test("line ranges collapse consecutive lines", () => {
  assert.equal(lineRanges([12, 4, 5, 6, 20, 21]), "4-6, 12, 20-21");
});

test("Sonar issues: standard and MQR modes, readability split", () => {
  const [smell, mqr, readable, complex] = normalizeSonarIssues(
    [
      issue(),
      {
        ...issue(),
        type: undefined,
        severity: undefined,
        impacts: [{ softwareQuality: "SECURITY", severity: "HIGH" }],
      },
      issue({ cleanCodeAttribute: "CLEAR" }),
      issue({ rule: "typescript:S3776" }),
    ],
    KEY,
  );
  assert.equal(smell.file, "admin/src/a.ts");
  assert.equal(smell.effortMinutes, 10);
  assert.equal(smell.readability, false);
  assert.equal(mqr.type, "VULNERABILITY");
  assert.equal(mqr.severity, "HIGH");
  assert.equal(readable.readability, true);
  assert.equal(complex.readability, true);
});

test("Snyk JSON (all-projects and container) and SARIF are parsed and deduplicated", () => {
  const vuln = {
    id: "SNYK-1",
    title: "ReDoS",
    severity: "high",
    packageName: "x",
    version: "1.0.0",
    fixedIn: ["1.0.1"],
  };
  const deps = parseSnykJson(
    JSON.stringify([
      {
        displayTargetFile: "admin/package-lock.json",
        vulnerabilities: [vuln, vuln],
      },
    ]),
    "dependencies",
  );
  assert.equal(deps.length, 1);
  assert.deepEqual(deps[0], {
    source: "dependencies",
    id: "SNYK-1",
    title: "ReDoS",
    severity: "HIGH",
    package: "x@1.0.0",
    fix: "1.0.1",
    target: "admin/package-lock.json",
  });
  const container = parseSnykJson(
    JSON.stringify({
      vulnerabilities: [{ ...vuln, fixedIn: [], nearestFixedInVersion: null }],
      applications: [{ vulnerabilities: [{ ...vuln, id: "SNYK-2" }] }],
    }),
    "container",
  );
  assert.deepEqual(
    container.map((f) => f.id),
    ["SNYK-1", "SNYK-2"],
  );
  assert.equal(container[0].fix, null);
  const code = parseSnykSarif(
    JSON.stringify({
      runs: [
        {
          results: [
            {
              ruleId: "javascript/XSS",
              level: "error",
              message: { text: "XSS" },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: { uri: "admin/src/p.tsx" },
                    region: { startLine: 3 },
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  );
  assert.deepEqual(code[0], {
    source: "code",
    id: "javascript/XSS",
    title: "XSS",
    severity: "HIGH",
    file: "admin/src/p.tsx",
    line: 3,
  });
});

test("a clean PR has every dimension without improvements", () => {
  const sections = buildBreakdown({
    sonar: {
      measures: PERFECT,
      extra: { new_technical_debt: "0" },
      issues: [],
      hotspots: [],
    },
    snyk: { result: "success", findings: [] },
    coverage: { total: 4, covered: 4, percent: 100, uncovered: new Map() },
  });
  assert.equal(sections.length, 8);
  assert.ok(sections.every((s) => s.items.length === 0 && s.status === "✅"));
  const md = renderBreakdown(sections);
  assert.match(md, /No hay aspectos de mejora en ninguna dimensión/);
  assert.match(md, /\*\*Aspectos de mejora:\*\* ninguno\./);
});

test("each finding lands in its dimension with its improvement", () => {
  const issues = normalizeSonarIssues(
    [
      issue({ type: "BUG", severity: "CRITICAL", message: "Null deref" }),
      issue({ type: "VULNERABILITY", severity: "BLOCKER", message: "SQLi" }),
      issue({ message: "Función larga", effort: "1h" }),
      issue({
        cleanCodeAttribute: "IDENTIFIABLE",
        severity: "MINOR",
        message: "Renombrar variable",
      }),
    ],
    KEY,
  );
  const hotspots = normalizeHotspots(
    [
      {
        component: `${KEY}:backend/src/b.ts`,
        line: 2,
        message: "Regex",
        vulnerabilityProbability: "LOW",
      },
    ],
    KEY,
  );
  const sections = buildBreakdown({
    sonar: {
      measures: { ...PERFECT, new_duplicated_lines_density: "12" },
      extra: {},
      issues,
      hotspots,
    },
    snyk: {
      result: "failure",
      findings: [
        {
          source: "dependencies",
          id: "S",
          title: "Proto pollution",
          severity: "MEDIUM",
          package: "y@2",
          fix: null,
          target: null,
        },
      ],
    },
    coverage: {
      total: 10,
      covered: 5,
      percent: 50,
      uncovered: new Map([["admin/src/a.ts", [1, 2, 3, 9]]]),
    },
  });
  assert.equal(section(sections, "Seguridad").items.length, 2);
  assert.equal(section(sections, "Seguridad").status, "❌");
  assert.match(
    section(sections, "Vulnerabilidades").items[0].text,
    /sin versión corregida/,
  );
  assert.equal(section(sections, "Vulnerabilidades").status, "❌");
  assert.match(section(sections, "Fiabilidad").items[0].text, /Null deref/);
  assert.match(
    section(sections, "Mantenibilidad").items[0].text,
    /Función larga/,
  );
  assert.equal(section(sections, "Legibilidad").items.length, 1);
  assert.equal(section(sections, "Legibilidad").status, "⚠️");
  assert.match(section(sections, "Deuda").metrics[0], /1 h 10 min/);
  assert.match(section(sections, "Deuda").items[0].text, /\+1 h/);
  assert.equal(section(sections, "Duplicación").status, "❌");
  assert.match(section(sections, "Cobertura").items[0].text, /1-3, 9/);
  const md = renderBreakdown(sections, "https://sonarcloud.io/x");
  assert.match(md, /de severidad alta o mayor/);
  assert.match(md, /Ver el análisis completo en SonarQube Cloud/);
});

test("without Sonar the Sonar dimensions are not evaluated, Snyk and coverage still are", () => {
  const sections = buildBreakdown({
    sonar: null,
    snyk: { result: "skipped", findings: [] },
    coverage: NO_COVERAGE,
  });
  for (const title of [
    "Seguridad",
    "Fiabilidad",
    "Mantenibilidad",
    "Legibilidad",
    "Deuda",
    "Duplicación",
    "Vulnerabilidades",
  ]) {
    assert.equal(section(sections, title).status, "⏸️", title);
  }
  assert.equal(section(sections, "Cobertura").status, "✅");
  assert.match(renderBreakdown(sections), /no se pudieron evaluar/);
});

test("long lists are capped with a count of the rest", () => {
  const issues = normalizeSonarIssues(
    Array.from({ length: MAX_ITEMS + 3 }, (_, i) =>
      issue({ type: "BUG", line: i + 1 }),
    ),
    KEY,
  );
  const sections = buildBreakdown({
    sonar: { measures: PERFECT, extra: {}, issues, hotspots: [] },
    snyk: { result: "success", findings: [] },
    coverage: NO_COVERAGE,
  });
  assert.match(renderBreakdown(sections), /…y 3 más\./);
});
