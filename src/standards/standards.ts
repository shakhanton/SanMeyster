/**
 * Regulatory-profile engine. Evaluates measured quantities against the
 * `usedInEngine` StandardRule rows for one jurisdiction at a time — never
 * mixes jurisdictions (docs/ergonomics-and-standards.md §1).
 *
 * UA and DE each publish a *separate* mandatory rule set for accessible
 * (inclusive-design) installations vs. standard ones — mixing them would
 * silently apply the wrong norm (e.g. the accessible-only "≤300mm faucet to
 * front edge" rule to an ordinary residential basin). `accessible` selects
 * which rule set applies; it is never inferred.
 */
import type { Jurisdiction, StandardRule } from '../data/types'
import type { Verdict } from '../geometry/geometry'
import { standards } from '../data'

const STANDARD_BASIN_HEIGHT_RULES: Partial<Record<Jurisdiction, string>> = {
  UA: 'ua-basin-height-standard',
  professional: 'professional-basin-height-range',
  manufacturer: 'geberit-basin-height-general',
}

const ACCESSIBLE_BASIN_HEIGHT_RULES: Partial<Record<Jurisdiction, string>> = {
  UA: 'ua-basin-height-accessible',
  DE: 'de-basin-height-accessible-max',
}

const ACCESSIBLE_FAUCET_FRONT_DISTANCE_RULES: Partial<Record<Jurisdiction, string>> = {
  UA: 'ua-accessible-faucet-max-front-distance',
  DE: 'de-faucet-max-front-distance',
}

export interface StandardCheck {
  rule: StandardRule
  pass: boolean | null // null = no measured value to check against this rule
  measuredValue: number | null
}

export interface StandardCheckResult {
  verdict: Verdict
  checks: StandardCheck[]
}

function checkBasinHeight(rule: StandardRule, measured: number | null): StandardCheck {
  if (measured == null) return { rule, pass: null, measuredValue: null }

  if (rule.id === 'ua-basin-height-standard') {
    const tolerance = standards.find((r) => r.id === 'ua-basin-height-tolerance-individual')
    const tol = tolerance?.value.max ?? 0
    const nominal = rule.value.nominal ?? 0
    return { rule, pass: Math.abs(measured - nominal) <= tol, measuredValue: measured }
  }

  const { min, max } = rule.value
  const pass = (min == null || measured >= min) && (max == null || measured <= max)
  return { rule, pass, measuredValue: measured }
}

function checkBound(rule: StandardRule, measured: number | null): StandardCheck {
  if (measured == null) return { rule, pass: null, measuredValue: null }
  const { min, max } = rule.value
  const pass = (min == null || measured >= min) && (max == null || measured <= max)
  return { rule, pass, measuredValue: measured }
}

export function evaluateStandards(
  jurisdiction: Jurisdiction,
  accessible: boolean,
  basinHeightMm: number | null,
  faucetFrontDistanceMm: number | null,
): StandardCheckResult {
  const heightRuleId = accessible ? ACCESSIBLE_BASIN_HEIGHT_RULES[jurisdiction] : STANDARD_BASIN_HEIGHT_RULES[jurisdiction]
  const distanceRuleId = accessible ? ACCESSIBLE_FAUCET_FRONT_DISTANCE_RULES[jurisdiction] : undefined

  const heightRule = heightRuleId ? standards.find((r) => r.id === heightRuleId && r.usedInEngine) : undefined
  const distanceRule = distanceRuleId ? standards.find((r) => r.id === distanceRuleId && r.usedInEngine) : undefined

  const checks: StandardCheck[] = [
    ...(heightRule ? [checkBasinHeight(heightRule, basinHeightMm)] : []),
    ...(distanceRule ? [checkBound(distanceRule, faucetFrontDistanceMm)] : []),
  ]

  const applicable = checks.filter((c) => c.pass !== null)

  let verdict: Verdict
  if (checks.length === 0 || applicable.length === 0) {
    verdict = 'unknown'
  } else if (applicable.some((c) => c.rule.type === 'mandatory' && c.pass === false)) {
    verdict = 'fail'
  } else if (applicable.some((c) => c.pass === false)) {
    verdict = 'warning'
  } else {
    verdict = 'ok'
  }

  return { verdict, checks }
}
