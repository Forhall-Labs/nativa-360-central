/**
 * Desglose del PR score: todo lo que SonarQube Cloud, Snyk y la cobertura
 * encontraron en el PR, por dimensión (seguridad, vulnerabilidades,
 * fiabilidad, mantenibilidad, legibilidad, deuda técnica, duplicación,
 * cobertura), cada una con sus aspectos de mejora — o "ninguno" si no hay.
 * Funciones puras: index.mjs junta los datos y score.mjs calcula la nota.
 */

/** Ítems listados por dimensión; el resto se resume en "…y N más". */
export const MAX_ITEMS = 10;

const SEVERITY_ORDER = [
  "BLOCKER",
  "CRITICAL",
  "HIGH",
  "MAJOR",
  "MEDIUM",
  "MINOR",
  "LOW",
  "INFO",
];
const SEVERITY_LABEL = {
  BLOCKER: "bloqueante",
  CRITICAL: "crítica",
  HIGH: "alta",
  MAJOR: "mayor",
  MEDIUM: "media",
  MINOR: "menor",
  LOW: "baja",
  INFO: "info",
};
/** Severidades que dejan la dimensión en ❌ (el resto, en ⚠️). */
const SERIOUS = new Set(["BLOCKER", "CRITICAL", "HIGH", "MAJOR"]);
const GRADE = { 1: "A", 2: "B", 3: "C", 4: "D", 5: "E" };

/**
 * Atributos de Clean Code de Sonar que hablan de legibilidad, más la regla de
 * complejidad cognitiva (S3776): el resto de los code smells van a
 * mantenibilidad.
 */
const READABILITY_ATTRIBUTES = new Set([
  "FORMATTED",
  "CONVENTIONAL",
  "IDENTIFIABLE",
  "CLEAR",
]);
const COGNITIVE_COMPLEXITY = /:S3776$/;

/** Duplicación sobre código nuevo con puntaje completo (ver score.mjs). */
const DUPLICATION_TARGET = 3;
/** Cobertura de líneas cambiadas con puntaje completo (ver score.mjs). */
const COVERAGE_TARGET = 80;

/** "1h30min", "2d", "5min" → minutos (un día de Sonar son 8 horas). */
export function parseEffort(effort) {
  if (!effort) return 0;
  const factor = { d: 480, h: 60, min: 1 };
  // Tokens alternados número/unidad: sin backtracking (Sonar S8786).
  const tokens = String(effort).match(/\d+|[a-z]+/g) ?? [];
  let minutes = 0;
  for (let i = 0; i + 1 < tokens.length; i++) {
    const unit = factor[tokens[i + 1]];
    if (/^\d/.test(tokens[i]) && unit) minutes += Number(tokens[i]) * unit;
  }
  return minutes;
}

export function formatMinutes(total) {
  const minutes = Math.round(Number(total) || 0);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

const severityRank = (s) => {
  const i = SEVERITY_ORDER.indexOf(s);
  return i === -1 ? SEVERITY_ORDER.length : i;
};
const bySeverity = (a, b) =>
  severityRank(a.severity) - severityRank(b.severity);

function stripProject(component = "", projectKey = "") {
  return component.startsWith(`${projectKey}:`)
    ? component.slice(projectKey.length + 1)
    : component;
}

/**
 * Issues de `api/issues/search`. Soporta el modo estándar (type/severity) y
 * el MQR (impacts): sin `type`, la calidad del primer impacto lo define.
 */
export function normalizeSonarIssues(issues, projectKey) {
  return issues.map((issue) => {
    const impact = issue.impacts?.[0];
    const type =
      issue.type ??
      (impact?.softwareQuality === "SECURITY"
        ? "VULNERABILITY"
        : impact?.softwareQuality === "RELIABILITY"
          ? "BUG"
          : "CODE_SMELL");
    return {
      type,
      severity: String(impact?.severity ?? issue.severity ?? "").toUpperCase(),
      rule: issue.rule ?? "",
      message: issue.message ?? "",
      file: stripProject(issue.component, projectKey),
      line: issue.line ?? issue.textRange?.startLine ?? null,
      effortMinutes: parseEffort(issue.effort ?? issue.debt),
      readability:
        READABILITY_ATTRIBUTES.has(issue.cleanCodeAttribute) ||
        COGNITIVE_COMPLEXITY.test(issue.rule ?? ""),
    };
  });
}

/** Security hotspots por revisar, de `api/hotspots/search`. */
export function normalizeHotspots(hotspots, projectKey) {
  const PROBABILITY = { HIGH: "HIGH", MEDIUM: "MEDIUM", LOW: "LOW" };
  return hotspots.map((h) => ({
    file: stripProject(h.component, projectKey),
    line: h.line ?? h.textRange?.startLine ?? null,
    message: h.message ?? "",
    severity: PROBABILITY[h.vulnerabilityProbability] ?? "MEDIUM",
    category: h.securityCategory ?? null,
  }));
}

/**
 * Hallazgos de `snyk test --json-file-output` (objeto, o array con
 * --all-projects) o de `snyk container test` (con `applications`).
 * Snyk repite una vulnerabilidad por cada camino de dependencias: se cuenta
 * una vez por paquete y archivo.
 */
export function parseSnykJson(text, source) {
  const data = JSON.parse(text);
  const projects = Array.isArray(data)
    ? data
    : [data, ...(data.applications ?? [])];
  const findings = new Map();
  for (const project of projects) {
    const target = project.displayTargetFile ?? project.targetFile ?? null;
    for (const v of project.vulnerabilities ?? []) {
      const key = `${v.id}|${v.packageName}@${v.version}|${target}`;
      if (findings.has(key)) continue;
      findings.set(key, {
        source,
        id: v.id,
        title: v.title ?? v.id,
        severity: String(v.severity ?? "").toUpperCase(),
        package: `${v.packageName}@${v.version}`,
        fix: v.fixedIn?.length
          ? v.fixedIn.join(", ")
          : (v.nearestFixedInVersion ?? null),
        target,
      });
    }
  }
  return [...findings.values()];
}

/** Hallazgos de `snyk code test --sarif-file-output`. */
export function parseSnykSarif(text) {
  const LEVEL = { error: "HIGH", warning: "MEDIUM", note: "LOW" };
  const findings = [];
  for (const run of JSON.parse(text).runs ?? []) {
    for (const r of run.results ?? []) {
      const location = r.locations?.[0]?.physicalLocation;
      findings.push({
        source: "code",
        id: r.ruleId ?? "",
        title: r.message?.text ?? r.ruleId ?? "",
        severity: LEVEL[r.level] ?? "MEDIUM",
        file: location?.artifactLocation?.uri ?? null,
        line: location?.region?.startLine ?? null,
      });
    }
  }
  return findings;
}

/** "4-6, 12" a partir de [4, 5, 6, 12]. */
export function lineRanges(lines) {
  const sorted = [...new Set(lines)].sort((a, b) => a - b);
  const ranges = [];
  for (const n of sorted) {
    const last = ranges.at(-1);
    if (last && n === last[1] + 1) last[1] = n;
    else ranges.push([n, n]);
  }
  return ranges.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(", ");
}

const where = (file, line) =>
  file ? `\`${file}${line ? `:${line}` : ""}\`` : "";
const icon = (severity) =>
  SERIOUS.has(severity) ? "🔴" : severity === "MEDIUM" ? "🟠" : "🟡";
const label = (severity) =>
  SEVERITY_LABEL[severity] ?? (severity.toLowerCase() || "sin severidad");

function issueItem(issue) {
  const rule = issue.rule ? ` · regla ${issue.rule}` : "";
  const effort = issue.effortMinutes
    ? ` · ${formatMinutes(issue.effortMinutes)}`
    : "";
  return {
    severity: issue.severity,
    text: `${icon(issue.severity)} ${where(issue.file, issue.line)} — ${issue.message} _(${label(issue.severity)}${rule}${effort})_`,
  };
}

function statusOf(items, failing) {
  if (failing || items.some((i) => SERIOUS.has(i.severity))) return "❌";
  return items.length > 0 ? "⚠️" : "✅";
}

const NO_SONAR = "Sin datos de SonarQube Cloud para este commit.";
const grade = (rating) =>
  rating === undefined
    ? "sin código nuevo"
    : (GRADE[Math.round(Number(rating))] ?? rating);
const snykState = (result) =>
  result === "success"
    ? "pasó"
    : result === "failure"
      ? "falló"
      : result === "cancelled"
        ? "cancelado"
        : "desactivado (SNYK_ENABLED)";

/**
 * Las dimensiones del desglose. `input`:
 * - sonar: null si no hubo análisis; si no, { measures, extra, issues,
 *   hotspots } (issues/hotspots null si no se pudieron leer).
 * - snyk: { result: resultado del job ("success", "failure", "skipped"…),
 *   findings: hallazgos de parseSnykJson / parseSnykSarif }.
 * - coverage: resultado de changedLineCoverage (con `uncovered`).
 */
export function buildBreakdown({ sonar, snyk, coverage }) {
  const sections = [];
  const issues = sonar?.issues ? sonar.issues.slice().sort(bySeverity) : null;
  const hotspots = sonar?.hotspots
    ? sonar.hotspots.slice().sort(bySeverity)
    : null;
  const m = sonar?.measures ?? {};
  const extra = sonar?.extra ?? {};
  const ofType = (type) => (issues ?? []).filter((i) => i.type === type);
  const smells = ofType("CODE_SMELL");
  const findings = snyk?.findings ?? [];
  const sonarNote =
    sonar && !issues
      ? ["No se pudo leer la lista de issues de SonarQube Cloud."]
      : [];

  // Seguridad: vulnerabilidades y hotspots de Sonar, y Snyk Code.
  {
    const vulns = ofType("VULNERABILITY");
    const code = findings.filter((f) => f.source === "code").sort(bySeverity);
    const items = [
      ...vulns.map(issueItem),
      ...(hotspots ?? []).map((h) => ({
        severity: h.severity,
        text: `${icon(h.severity)} ${where(h.file, h.line)} — Revisar security hotspot: ${h.message} _(probabilidad ${label(h.severity)}${h.category ? ` · ${h.category}` : ""})_`,
      })),
      ...code.map((f) => ({
        severity: f.severity,
        text: `${icon(f.severity)} ${where(f.file, f.line)} — ${f.title} _(Snyk Code · ${label(f.severity)} · ${f.id})_`,
      })),
    ];
    sections.push({
      title: "🔒 Seguridad",
      metrics: sonar
        ? [
            `Nota Sonar: ${grade(m.new_security_rating)}`,
            `Vulnerabilidades: ${issues ? vulns.length : "?"}`,
            `Hotspots por revisar: ${hotspots ? hotspots.length : "?"}`,
            `Hotspots revisados: ${m.new_security_hotspots_reviewed === undefined ? "sin hotspots nuevos" : `${Number(m.new_security_hotspots_reviewed).toFixed(0)} %`}`,
            `Snyk Code: ${code.length} hallazgos`,
          ]
        : [NO_SONAR, `Snyk Code: ${code.length} hallazgos`],
      notes: sonarNote,
      items,
      status:
        !sonar && items.length === 0
          ? "⏸️"
          : statusOf(items, snyk?.result === "failure" && code.length > 0),
    });
  }

  // Vulnerabilidades en dependencias (package-lock.json) y en la imagen.
  {
    const deps = findings.filter((f) => f.source !== "code").sort(bySeverity);
    const count = (s) => deps.filter((f) => f.severity === s).length;
    const items = deps.map((f) => ({
      severity: f.severity,
      text: `${icon(f.severity)} \`${f.package}\`${f.target ? ` en \`${f.target}\`` : ""} — ${f.title} _(${label(f.severity)} · ${f.source === "container" ? "imagen del backend" : "dependencia"})_ → ${f.fix ? `actualizar a ${f.fix}` : "sin versión corregida todavía: evaluar reemplazo o mitigación"}`,
    }));
    sections.push({
      title: "🛡️ Vulnerabilidades en dependencias y contenedor",
      metrics: [
        `Snyk: ${snykState(snyk?.result)}`,
        `Críticas: ${count("CRITICAL")}`,
        `Altas: ${count("HIGH")}`,
        `Medias: ${count("MEDIUM")}`,
        `Bajas: ${count("LOW")}`,
      ],
      notes: [],
      items,
      status:
        items.length === 0 && !["success", "failure"].includes(snyk?.result)
          ? "⏸️"
          : statusOf(items, snyk?.result === "failure"),
    });
  }

  // Fiabilidad: bugs.
  {
    const bugs = ofType("BUG");
    const items = bugs.map(issueItem);
    sections.push({
      title: "🐞 Fiabilidad (bugs)",
      metrics: sonar
        ? [
            `Nota Sonar: ${grade(m.new_reliability_rating)}`,
            `Bugs: ${issues ? bugs.length : "?"}`,
          ]
        : [NO_SONAR],
      notes: sonarNote,
      items,
      status: sonar ? statusOf(items) : "⏸️",
    });
  }

  // Mantenibilidad y legibilidad: code smells, separados por atributo.
  {
    const maintainability = smells.filter((i) => !i.readability).map(issueItem);
    sections.push({
      title: "🧹 Mantenibilidad",
      metrics: sonar
        ? [
            `Nota Sonar: ${grade(m.new_maintainability_rating)}`,
            `Code smells: ${issues ? maintainability.length : "?"}`,
          ]
        : [NO_SONAR],
      notes: sonarNote,
      items: maintainability,
      status: sonar ? statusOf(maintainability) : "⏸️",
    });
    const readability = smells.filter((i) => i.readability).map(issueItem);
    sections.push({
      title: "📖 Legibilidad",
      metrics: sonar
        ? [
            `Problemas de legibilidad (formato, nombres, claridad, complejidad cognitiva): ${issues ? readability.length : "?"}`,
          ]
        : [NO_SONAR],
      notes: sonarNote,
      items: readability,
      status: sonar ? statusOf(readability) : "⏸️",
    });
  }

  // Deuda técnica: esfuerzo estimado para corregir los code smells nuevos.
  {
    const debt =
      extra.new_technical_debt !== undefined
        ? Number(extra.new_technical_debt)
        : smells.reduce((sum, i) => sum + i.effortMinutes, 0);
    const costly = smells
      .filter((i) => i.effortMinutes > 0)
      .sort((a, b) => b.effortMinutes - a.effortMinutes || bySeverity(a, b))
      .slice(0, 5)
      .map((i) => ({
        severity: i.severity,
        text: `${icon(i.severity)} ${where(i.file, i.line)} — ${i.message} _(+${formatMinutes(i.effortMinutes)})_`,
      }));
    sections.push({
      title: "💸 Deuda técnica",
      metrics: sonar
        ? [
            `Deuda nueva: ${formatMinutes(debt)}`,
            `Ratio de deuda: ${extra.new_sqale_debt_ratio === undefined ? "sin datos" : `${Number(extra.new_sqale_debt_ratio).toFixed(1)} %`}`,
            `Líneas nuevas: ${extra.new_lines ?? "sin datos"}`,
          ]
        : [NO_SONAR],
      notes:
        costly.length > 0
          ? ["Lo que más deuda suma (corregirlo primero):"]
          : sonarNote,
      items: costly,
      status: sonar ? statusOf(costly) : "⏸️",
    });
  }

  // Duplicación.
  {
    const value = m.new_duplicated_lines_density;
    const items =
      value !== undefined && Number(value) > DUPLICATION_TARGET
        ? [
            {
              severity: Number(value) >= 10 ? "MAJOR" : "MEDIUM",
              text: `🟠 ${Number(value).toFixed(1)} % de las líneas nuevas están duplicadas (puntaje completo hasta ${DUPLICATION_TARGET} %): extraer lo repetido a funciones, hooks o componentes compartidos. El detalle por archivo está en SonarQube Cloud.`,
            },
          ]
        : [];
    sections.push({
      title: "📑 Duplicación",
      metrics: sonar
        ? [
            `Duplicación en código nuevo: ${value === undefined ? "sin código nuevo" : `${Number(value).toFixed(1)} %`}`,
          ]
        : [NO_SONAR],
      notes: [],
      items,
      status: sonar ? statusOf(items) : "⏸️",
    });
  }

  // Cobertura de las líneas que el PR cambia.
  {
    const below =
      coverage.percent !== null && coverage.percent < COVERAGE_TARGET;
    const items = below
      ? [...(coverage.uncovered ?? new Map())]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([file, lines]) => ({
            severity: "MEDIUM",
            text: `🟠 \`${file}\` — líneas sin tests: ${lineRanges(lines)}`,
          }))
      : [];
    sections.push({
      title: "🧪 Cobertura de las líneas cambiadas",
      metrics: [
        coverage.percent === null
          ? "El PR no cambia líneas ejecutables con tests"
          : `${coverage.percent.toFixed(1)} % (${coverage.covered}/${coverage.total} líneas; puntaje completo desde ${COVERAGE_TARGET} %)`,
      ],
      notes: below ? ["Agregar tests que ejecuten estas líneas:"] : [],
      items,
      status: below ? "⚠️" : "✅",
    });
  }

  return sections;
}

function renderSection({ title, status, metrics, notes, items }) {
  const shown = items.slice(0, MAX_ITEMS).map((i) => `- ${i.text}`);
  if (items.length > MAX_ITEMS)
    shown.push(`- …y ${items.length - MAX_ITEMS} más.`);
  const improvements =
    items.length === 0
      ? status === "⏸️"
        ? "**Aspectos de mejora:** no se pudieron evaluar."
        : "**Aspectos de mejora:** ninguno."
      : `**Aspectos de mejora (${items.length}):**\n\n${notes.map((n) => `${n}\n\n`).join("")}${shown.join("\n")}`;
  const extraNotes =
    items.length === 0 && notes.length > 0 ? `\n\n${notes.join("\n\n")}` : "";
  return `<details${items.length > 0 ? " open" : ""}>
<summary><b>${status} ${title}</b> — ${items.length > 0 ? `${items.length} aspecto${items.length === 1 ? "" : "s"} de mejora` : status === "⏸️" ? "no evaluado" : "sin aspectos de mejora"}</summary>

${metrics.map((x) => `- ${x}`).join("\n")}

${improvements}${extraNotes}

</details>`;
}

/** El desglose en Markdown, para el comentario del PR y el job summary. */
export function renderBreakdown(sections, sonarUrl) {
  const total = sections.reduce((sum, s) => sum + s.items.length, 0);
  const serious = sections.reduce(
    (sum, s) => sum + s.items.filter((i) => SERIOUS.has(i.severity)).length,
    0,
  );
  const pending = sections.filter((s) => s.status === "⏸️").length;
  const summary =
    total === 0
      ? pending === 0
        ? "No hay aspectos de mejora en ninguna dimensión."
        : "No se encontraron aspectos de mejora en lo que se pudo evaluar."
      : `**${total} aspecto${total === 1 ? "" : "s"} de mejora** (${serious} de severidad alta o mayor). Cada dimensión los lista de más a menos grave.`;
  const pendingNote =
    pending === 0
      ? ""
      : ` ${pending} dimensi${pending === 1 ? "ón no se pudo" : "ones no se pudieron"} evaluar (⏸️): falta el análisis de SonarQube Cloud o Snyk está desactivado.`;
  return `### Desglose

${summary}${pendingNote}

${sections.map(renderSection).join("\n\n")}
${sonarUrl ? `\n[Ver el análisis completo en SonarQube Cloud](${sonarUrl})\n` : ""}`;
}
