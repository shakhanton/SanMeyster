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

  const outerDepthMm = basin.depth?.value ?? null
  const bowlDepthMm = basin.bowlDepth?.value ?? outerDepthMm
  const spoutProjectionMm = faucet.spoutProjection?.value ?? null
  const spoutHeightMm = faucet.spoutHeight?.value ?? null
  const faucetMountYMm = input.faucetMountYMm

  const geometry = evaluateGeometry({
    bowlDepthMm,
    faucetMountYMm,
    spoutProjectionMm,
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

  const caveats: string[] = []
  if (!basin.bowlDepth) caveats.push('Глибина чаші невідома — використано зовнішню глибину раковини як наближення.')
  if (faucetMountYMm == null) caveats.push('Позиція кріплення змішувача введена користувачем — не підтверджена виробником.')
  if (faucet.spoutHeight?.confidence === 'C' || faucet.spoutProjection?.confidence === 'C') {
    caveats.push('Характеристики змішувача мають знижену довіру (джерело не першоджерело виробника).')
  }
  if (input.installedBasinHeightMm == null) caveats.push('Висота встановлення раковини не вказана.')
  const dataQuality: DataQualityResult = { verdict: caveats.length > 0 ? 'warning' : 'ok', caveats }

  const explanation: ExplanationEntry[] = []
  if (basin.depth) {
    explanation.push({
      label: 'Глибина раковини',
      value: `${basin.depth.value} мм`,
      source: basin.depth.source,
      sourceUrl: basin.depth.sourceUrl,
    })
  }
  if (faucet.spoutProjection) {
    explanation.push({
      label: 'Виліт носика змішувача',
      value: `${faucet.spoutProjection.value} мм`,
      source: faucet.spoutProjection.source,
      sourceUrl: faucet.spoutProjection.sourceUrl,
    })
  }
  if (faucet.spoutHeight) {
    explanation.push({
      label: 'Висота виливу над бортом',
      value: `${faucet.spoutHeight.value} мм`,
      source: faucet.spoutHeight.source,
      sourceUrl: faucet.spoutHeight.sourceUrl,
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
