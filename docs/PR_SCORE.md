# PR score

Every pull request into `main` gets a score from 0 to 100. The **PR score**
check fails below **80**, and the protection of `main` requires it.

It is the `PR score` job of `.github/workflows/ci.yml`; the calculation is
`scripts/pr-score/score.mjs` (tested by `score.test.mjs`). The result is posted as one PR comment, updated on every push: it shows
"calculando…" while the job waits for the other checks of the new commit, then
the score, and always names the evaluated commit with a link to the run. The
job summary has the same report.

## When the score is given

Only after every other check passes on the same commit: the jobs of `ci.yml`
it needs (the per-project checks and the three Snyk jobs; a skipped job, such
as Snyk while it is disabled, does not block) and the external checks in
`REQUIRED_CHECKS` (SonarCloud Code Analysis), which it waits for up to 45
minutes. If one fails, or does not finish in time, the score is withheld: the
comment lists what failed and **PR score** fails as well. Each push to the PR
runs everything again on the new commit.

## Formula

| Criterion                     | Points | Source                                                                                                  |
| ----------------------------- | -----: | ------------------------------------------------------------------------------------------------------- |
| Security of new code          |     25 | SonarQube Cloud rating: A all, B 60 %, C 20 %, D/E none                                                 |
| Reliability (bugs)            |     20 | SonarQube Cloud rating, same scale                                                                      |
| Maintainability               |     15 | SonarQube Cloud rating, same scale                                                                      |
| Coverage of the changed lines |     20 | Coverage (Vitest / Jest) of the lines the PR adds or modifies: all points from 80 %, proportional below |
| Duplication on new code       |     10 | SonarQube Cloud: all points up to 3 %, none from 10 %, linear between                                   |
| Security hotspots reviewed    |     10 | SonarQube Cloud: proportional to the share reviewed                                                     |

Building, tests and Snyk are separate required checks; they do not add points.

## Details

- **Coverage** counts only changed lines that are executable and inside a
  coverage report: each project's `npm run test:cov` (Vitest with
  `@vitest/coverage-v8` in admin, e-com and landing; Jest in backend) writes
  `coverage/lcov.info`, which the matrix job uploads as the artifact
  `coverage-<project>`. Only the projects the PR touches are tested. A PR that
  changes no such line (docs, configuration) gets the 20 points.
- **SonarQube Cloud** uses Automatic Analysis. The job waits up to 20 minutes for
  the analysis of the PR's exact head commit, and fails if it does not arrive,
  rather than scoring without data. A measure Sonar does not report (no new
  code of that kind) keeps its points.
- The threshold and weights live in `score.mjs`; change them there and in this
  table together.
- SonarQube Cloud's project key comes from the repository variable
  `SONAR_PROJECT_KEY`; without it the check fails instead of scoring without
  data.
- The check runs from the PR's own branch: a branch created before this
  workflow existed must merge `main` to get it.
