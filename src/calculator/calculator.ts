/**
 * Compatibility engine — orchestrates geometry, ergonomics and standards
 * into five independent axes (docs/engineering-model.md §4). Deliberately
 * does NOT combine them into a single score.
 */
import type { Basin, Faucet, Jurisdiction } from '../data/types'
import { computeLandingPoint, evaluateGeometry, type GeometryResult, type Verdict } from '../geometry/geometry'
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
  geometry: GeometryResult
  ergonomics: ErgonomicsResult
  standards: StandardCheckResult
  manufacturer: ManufacturerResult
  dataQuality: DataQualityResult
  explanation: ExplanationEntry[]
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

  const geometry = evaluateGeometry({
    bowlDepthMm,
    faucetMountYMm,
    spoutProjectionMm,
    spoutHeightMm,
    jetAngleDeg,
  })
  const landingYMm = geometry.landing.yMm

  const targetZone = computeTargetZone(bowlDepthMm)
  const ergonomics = evaluateErgonomics(landingYMm, targetZone, spoutHeightMm)

  const basinHeightMm = input.installedBasinHeightMm
  const faucetFrontDistanceMm =
    outerDepthMm != null && faucetMountYMm != null ? outerDepthMm - faucetMountYMm : null
  const standardsResult = evaluateStandards(jurisdiction, input.accessible, basinHeightMm, faucetFrontDistanceMm)

  const manufacturer: ManufacturerResult = faucet.recommendedBasinModels?.includes(basin.id)
    ? { verdict: 'ok', message: 'Виробник прямо рекомендує цю пару.' }
    : { verdict: 'unknown', message: 'Виробник не публікує прямої рекомендації для цієї пари моделей.' }

  const depthOverridden = input.basinDepthOverrideMm != null && input.basinDepthOverrideMm !== basin.depth?.value
  const projectionOverridden = input.spoutProjectionOverrideMm != null && input.spoutProjectionOverrideMm !== faucet.spoutProjection?.value
  const heightOverridden = input.spoutHeightOverrideMm != null && input.spoutHeightOverrideMm !== faucet.spoutHeight?.value

  const caveats: string[] = []
  if (!basin.bowlDepth) caveats.push('Глибина чаші невідома — використано зовнішню глибину раковини як наближення.')
  if (faucetMountYMm == null) caveats.push('Позиція кріплення змішувача введена користувачем — не підтверджена виробником.')
  if (faucet.spoutHeight?.confidence === 'C' || faucet.spoutProjection?.confidence === 'C') {
    caveats.push('Характеристики змішувача мають знижену довіру (джерело не першоджерело виробника).')
  }
  if (input.installedBasinHeightMm == null) caveats.push('Висота встановлення раковини не вказана.')
  if (depthOverridden || projectionOverridden || heightOverridden) {
    caveats.push('Одна чи більше характеристик відредаговані вручну та відрізняються від каталожних значень.')
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
    ergonomics,
    standards: standardsResult,
    manufacturer,
    dataQuality,
    explanation,
  }
}

export { computeLandingPoint }
