/**
 * Compatibility engine — orchestrates geometry, ergonomics and standards
 * into five independent axes (docs/engineering-model.md §4). Deliberately
 * does NOT combine them into a single score.
 */
import type { Basin, Faucet, Jurisdiction } from '../data/types'
import {
  computeLandingPoint,
  evaluateGeometry,
  evaluateRimClearance,
  type ClearanceResult,
  type GeometryResult,
  type Verdict,
} from '../geometry/geometry'
import { computeTargetZone, evaluateErgonomics, type ErgonomicsResult, type TargetZone } from '../ergonomics/ergonomics'
import { evaluateStandards, type StandardCheckResult } from '../standards/standards'

export interface CalculatorInput {
  basin: Basin
  faucet: Faucet
  jurisdiction: Jurisdiction
  /** Selects the accessible/inclusive-design rule set vs. the standard one
   *  for jurisdictions that publish both (UA) or only an accessible one (DE).
   *  Never inferred — see src/standards/standards.ts. */
  accessible: boolean
  /** User-supplied: distance from the basin's rear edge to the faucet mount, mm.
   *  No catalog entry currently has this field (research gap) — always user input. */
  faucetMountYMm: number | null
  /** User-supplied mounting height above finished floor, mm. This is an installation
   *  decision, not a product spec — it is NOT the same quantity as `basin.height`
   *  (the basin's own physical rim-to-base dimension) and must never fall back to it. */
  installedBasinHeightMm: number | null

  /** Editable overrides for catalog characteristics — the UI pre-fills these
   *  from the sourced catalog value and lets the user correct them against
   *  their actual fixtures. `null`/undefined falls back to the catalog value. */
  basinDepthOverrideMm?: number | null
  spoutProjectionOverrideMm?: number | null
  spoutHeightOverrideMm?: number | null
  /** The basin's own physical height (rim above its base/the mounting
   *  surface) — NOT installedBasinHeightMm (floor-to-rim). Used only for
   *  the rim-clearance check below. */
  basinRimHeightOverrideMm?: number | null
  /** Jet exit angle from vertical, degrees. Always user-supplied — no
   *  researched source publishes this for any faucet. Defaults to 0
   *  (straight down). See src/geometry/geometry.ts computeLandingPoint. */
  jetAngleDeg?: number
}

export interface ManufacturerResult {
  verdict: Verdict
  message: string
}

export interface DataQualityResult {
  verdict: 'ok' | 'warning'
  caveats: string[]
}

export interface ExplanationEntry {
  label: string
  value: string
  source: string | null
  sourceUrl: string | null
}

export interface CalculatorResult {
  landingYMm: number | null
  targetZone: TargetZone
  /** Combined geometry axis: horizontal containment (evaluateGeometry) AND
   *  vertical rim clearance (evaluateRimClearance) merged — worst verdict,
   *  concatenated messages. Both checks answer the same question ("does the
   *  water physically get into the bowl?"), just on different axes. */
  geometry: GeometryResult
  /** The vertical rim-clearance check on its own, for callers (the side
   *  elevation diagram, the explanation panel) that need it un-merged. */
  clearance: ClearanceResult
  /** The rim height actually compared against in the clearance check
   *  (resolved for installation type — see calculate()), for diagrams. */
  resolvedRimHeightMm: number | null
  ergonomics: ErgonomicsResult
  standards: StandardCheckResult
  manufacturer: ManufacturerResult
  dataQuality: DataQualityResult
  explanation: ExplanationEntry[]
}

const VERDICT_SEVERITY: Record<Verdict, number> = { fail: 0, warning: 1, unknown: 2, ok: 3 }
function worstVerdict(a: Verdict, b: Verdict): Verdict {
  return VERDICT_SEVERITY[a] <= VERDICT_SEVERITY[b] ? a : b
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const { basin, faucet, jurisdiction } = input

  // A user-edited depth overrides whichever depth concept the catalog would
  // otherwise have supplied (bowl interior depth if known, else outer
  // footprint depth) — the UI presents this as a single "depth" field, and
  // no catalog entry currently has both simultaneously, so one merged value
  // avoids a distinction the user has no way to express two numbers for.
  const outerDepthMm = input.basinDepthOverrideMm ?? basin.depth?.value ?? null
  const bowlDepthMm = input.basinDepthOverrideMm ?? basin.bowlDepth?.value ?? basin.depth?.value ?? null
  const spoutProjectionMm = input.spoutProjectionOverrideMm ?? faucet.spoutProjection?.value ?? null
  const spoutHeightMm = input.spoutHeightOverrideMm ?? faucet.spoutHeight?.value ?? null
  const jetAngleDeg = input.jetAngleDeg ?? 0
  const faucetMountYMm = input.faucetMountYMm

  const horizontalGeometry = evaluateGeometry({
    bowlDepthMm,
    faucetMountYMm,
    spoutProjectionMm,
    spoutHeightMm,
    jetAngleDeg,
  })
  const landingYMm = horizontalGeometry.landing.yMm

  // Rim height above the surface the faucet is mounted on — NOT the same
  // quantity as installedBasinHeightMm (floor-to-rim). One user-editable
  // number, always: 0 means the rim sits flush/recessed with the counter
  // (the natural case for inset/undermount), a positive value means the
  // basin sits that far above it (countertop/furniture, using the basin's
  // own height as the catalog default). Never hardcoded by installation
  // type — the user can always correct it (a "semi-inset" bowl, etc.). A
  // wall-mounted basin has no shared mounting surface with the faucet at
  // all, so the check doesn't apply there regardless of this value.
  const resolvedRimHeightMm = input.basinRimHeightOverrideMm ?? basin.height?.value ?? null
  const clearance =
    basin.installationType === 'wall-mounted'
      ? { verdict: 'unknown' as const, message: 'Перевірка вертикального зазору не застосовується до настінного встановлення — немає спільної стільниці зі змішувачем.' }
      : evaluateRimClearance(spoutHeightMm, resolvedRimHeightMm)

  const geometry: GeometryResult = {
    ...horizontalGeometry,
    verdict: worstVerdict(horizontalGeometry.verdict, clearance.verdict),
    message: clearance.verdict === 'unknown' ? horizontalGeometry.message : `${horizontalGeometry.message} ${clearance.message}`,
  }

  const targetZone = computeTargetZone(bowlDepthMm)
  const ergonomics = evaluateErgonomics(landingYMm, targetZone, spoutHeightMm)

  const basinHeightMm = input.installedBasinHeightMm
  // The faucet mounts behind the rear edge (toward the wall), not inside
  // the basin (see src/geometry/geometry.ts), so its distance from the
  // FRONT edge — what the ДБН/DIN accessibility rules actually measure —
  // is the basin's own depth plus that gap behind it, not minus.
  const faucetFrontDistanceMm =
    outerDepthMm != null && faucetMountYMm != null ? outerDepthMm + faucetMountYMm : null
  const standardsResult = evaluateStandards(jurisdiction, input.accessible, basinHeightMm, faucetFrontDistanceMm)

  const manufacturer: ManufacturerResult = faucet.recommendedBasinModels?.includes(basin.id)
    ? { verdict: 'ok', message: 'Виробник прямо рекомендує цю пару.' }
    : { verdict: 'unknown', message: 'Виробник не публікує прямої рекомендації для цієї пари моделей.' }

  const depthOverridden = input.basinDepthOverrideMm != null && input.basinDepthOverrideMm !== basin.depth?.value
  const projectionOverridden = input.spoutProjectionOverrideMm != null && input.spoutProjectionOverrideMm !== faucet.spoutProjection?.value
  const heightOverridden = input.spoutHeightOverrideMm != null && input.spoutHeightOverrideMm !== faucet.spoutHeight?.value
  const rimHeightOverridden = input.basinRimHeightOverrideMm != null && input.basinRimHeightOverrideMm !== basin.height?.value

  const caveats: string[] = []
  if (!basin.bowlDepth) caveats.push('Глибина чаші невідома — використано зовнішню глибину раковини як наближення.')
  if (faucetMountYMm == null) caveats.push('Позиція кріплення змішувача введена користувачем — не підтверджена виробником.')
  if (faucet.spoutHeight?.confidence === 'C' || faucet.spoutProjection?.confidence === 'C') {
    caveats.push('Характеристики змішувача мають знижену довіру (джерело не першоджерело виробника).')
  }
  if (input.installedBasinHeightMm == null) caveats.push('Висота встановлення раковини не вказана.')
  if (depthOverridden || projectionOverridden || heightOverridden || rimHeightOverridden) {
    caveats.push('Одна чи більше характеристик відредаговані вручну та відрізняються від каталожних значень.')
  }
  if (clearance.verdict === 'unknown' && basin.installationType !== 'wall-mounted') {
    caveats.push('Невідома висота раковини — неможливо перевірити, чи вистачає висоти виливу, щоб перекрити борт.')
  }
  if (jetAngleDeg !== 0) {
    caveats.push('Кут струменя — це введене користувачем припущення (heuristic), жоден виробник його не публікує.')
  }
  const dataQuality: DataQualityResult = { verdict: caveats.length > 0 ? 'warning' : 'ok', caveats }

  const explanation: ExplanationEntry[] = []
  if (basin.depth) {
    explanation.push({
      label: 'Глибина раковини',
      value: depthOverridden ? `${outerDepthMm} мм (відредаговано користувачем)` : `${basin.depth.value} мм`,
      source: depthOverridden ? 'Введено користувачем' : basin.depth.source,
      sourceUrl: depthOverridden ? null : basin.depth.sourceUrl,
    })
  }
  if (faucet.spoutProjection) {
    explanation.push({
      label: 'Виліт носика змішувача',
      value: projectionOverridden ? `${spoutProjectionMm} мм (відредаговано користувачем)` : `${faucet.spoutProjection.value} мм`,
      source: projectionOverridden ? 'Введено користувачем' : faucet.spoutProjection.source,
      sourceUrl: projectionOverridden ? null : faucet.spoutProjection.sourceUrl,
    })
  }
  if (faucet.spoutHeight) {
    explanation.push({
      label: 'Висота виливу над бортом',
      value: heightOverridden ? `${spoutHeightMm} мм (відредаговано користувачем)` : `${faucet.spoutHeight.value} мм`,
      source: heightOverridden ? 'Введено користувачем' : faucet.spoutHeight.source,
      sourceUrl: heightOverridden ? null : faucet.spoutHeight.sourceUrl,
    })
  }
  if (jetAngleDeg !== 0) {
    explanation.push({
      label: 'Кут струменя від вертикалі',
      value: `${jetAngleDeg}° (heuristic, введено користувачем)`,
      source: 'Немає джерела — жоден виробник не публікує кут виходу струменя',
      sourceUrl: null,
    })
  }
  if (basin.installationType !== 'wall-mounted' && resolvedRimHeightMm != null) {
    explanation.push({
      label: 'Висота раковини (борт над стільницею)',
      value: rimHeightOverridden
        ? `${resolvedRimHeightMm} мм (відредаговано користувачем)`
        : basin.height
          ? `${basin.height.value} мм`
          : `${resolvedRimHeightMm} мм (0 = врівень зі стільницею)`,
      source: rimHeightOverridden ? 'Введено користувачем' : (basin.height?.source ?? null),
      sourceUrl: rimHeightOverridden ? null : (basin.height?.sourceUrl ?? null),
    })
  }
  for (const check of standardsResult.checks) {
    explanation.push({
      label: check.rule.parameter,
      value: `${check.rule.value.raw} ${check.rule.unit} (${check.rule.type}, ${check.rule.jurisdiction})`,
      source: check.rule.source,
      sourceUrl: check.rule.url,
    })
  }

  return {
    landingYMm,
    targetZone,
    geometry,
    clearance,
    resolvedRimHeightMm,
    ergonomics,
    standards: standardsResult,
    manufacturer,
    dataQuality,
    explanation,
  }
}

export { computeLandingPoint }
