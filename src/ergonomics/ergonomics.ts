/**
 * Ergonomics engine — target zone (docs/engineering-model.md §3) and
 * spout-height comfort check, built only from `heuristic`-tagged sourced
 * values in src/data/standards.json. Never fails hard (heuristics only warn).
 */
import type { Verdict } from '../geometry/geometry'
import { standards } from '../data'

const TARGET_ZONE_MIN_INSET = standards.find((s) => s.id === 'heuristic-target-zone-inset-min')!
const TARGET_ZONE_MAX_INSET = standards.find((s) => s.id === 'heuristic-target-zone-inset-max')!
const SPOUT_HEIGHT_COMFORT = standards.find((s) => s.id === 'heuristic-spout-height-comfort')!
const MAX_SPLASH_DROP = standards.find((s) => s.id === 'heuristic-max-splash-drop')!

export interface TargetZone {
  minimumYMm: number | null
  preferredYMm: number | null
  maximumYMm: number | null
  basis: 'heuristic' | 'unknown'
}

/**
 * Converts the heuristic "127–254mm past the front inner rim, toward the
 * drain" (research §9) into an absolute Y-range, given the bowl's front
 * edge position (Y=bowlDepthMm in this module's coordinate system).
 */
export function computeTargetZone(bowlDepthMm: number | null): TargetZone {
  if (bowlDepthMm == null) {
    return { minimumYMm: null, preferredYMm: null, maximumYMm: null, basis: 'unknown' }
  }
  const insetMin = TARGET_ZONE_MIN_INSET.value.min! // 127mm
  const insetMax = TARGET_ZONE_MAX_INSET.value.max! // 254mm
  const minimumYMm = bowlDepthMm - insetMax
  const maximumYMm = bowlDepthMm - insetMin
  return {
    minimumYMm,
    preferredYMm: (minimumYMm + maximumYMm) / 2,
    maximumYMm,
    basis: 'heuristic',
  }
}

export interface SpoutHeightCheck {
  verdict: Verdict
  message: string
}

export function evaluateSpoutHeight(spoutHeightMm: number | null): SpoutHeightCheck {
  if (spoutHeightMm == null) {
    return { verdict: 'unknown', message: 'Висота виливу над бортом невідома.' }
  }
  const max = MAX_SPLASH_DROP.value.max!
  if (spoutHeightMm > max) {
    return {
      verdict: 'warning',
      message: `Висота виливу (${spoutHeightMm} мм) перевищує евристичну межу ${max} мм — підвищений ризик розбризкування.`,
    }
  }
  const { min, max: comfortMax } = SPOUT_HEIGHT_COMFORT.value
  if (spoutHeightMm >= min! && spoutHeightMm <= comfortMax!) {
    return { verdict: 'ok', message: `Висота виливу (${spoutHeightMm} мм) у комфортному діапазоні.` }
  }
  return {
    verdict: 'warning',
    message: `Висота виливу (${spoutHeightMm} мм) поза евристичним комфортним діапазоном ${min}–${comfortMax} мм.`,
  }
}

export interface ErgonomicsResult {
  verdict: Verdict
  targetZone: TargetZone
  landingInZone: Verdict
  spoutHeight: SpoutHeightCheck
  message: string
}

export function evaluateErgonomics(landingYMm: number | null, targetZone: TargetZone, spoutHeightMm: number | null): ErgonomicsResult {
  const spoutHeight = evaluateSpoutHeight(spoutHeightMm)

  let landingInZone: Verdict
  let zoneMessage: string
  if (landingYMm == null || targetZone.basis === 'unknown') {
    landingInZone = 'unknown'
    zoneMessage = 'Неможливо перевірити точку падіння відносно target zone — недостатньо даних.'
  } else if (landingYMm >= targetZone.minimumYMm! && landingYMm <= targetZone.maximumYMm!) {
    landingInZone = 'ok'
    zoneMessage = 'Точка падіння в рекомендованій зоні (target zone).'
  } else {
    landingInZone = 'warning'
    zoneMessage = 'Точка падіння поза евристичною рекомендованою зоною.'
  }

  const verdicts = [landingInZone, spoutHeight.verdict]
  const verdict: Verdict = verdicts.includes('fail')
    ? 'fail'
    : verdicts.includes('warning')
      ? 'warning'
      : verdicts.includes('unknown')
        ? 'unknown'
        : 'ok'

  return {
    verdict,
    targetZone,
    landingInZone,
    spoutHeight,
    message: zoneMessage,
  }
}
