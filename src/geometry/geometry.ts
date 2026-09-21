/**
 * Pure geometry engine. No UI, no data-layer imports — see
 * docs/engineering-model.md §1–2 for the coordinate system and the
 * declared "vertical fall" assumption this module implements.
 */

export type Verdict = 'ok' | 'warning' | 'fail' | 'unknown'

export interface GeometryInput {
  /** Effective bowl depth (bowlDepth, falling back to outer depth) in mm, or null if unknown. */
  bowlDepthMm: number | null
  /** Faucet mount position, distance from the rear edge (Y=0), in mm. */
  faucetMountYMm: number | null
  /** Faucet's horizontal reach from its mount, in mm. */
  spoutProjectionMm: number | null
}

export interface LandingPoint {
  yMm: number | null
  insufficientData: boolean
  reason: string | null
}

/**
 * Landing point Y-position under Assumption A (docs/engineering-model.md §2):
 * water falls vertically from the outlet, so landingY = mount position +
 * spout projection. There is no sourced exit angle/velocity to integrate a
 * true trajectory from, so this is a placement, not a ballistic computation.
 */
export function computeLandingPoint(input: Pick<GeometryInput, 'faucetMountYMm' | 'spoutProjectionMm'>): LandingPoint {
  if (input.faucetMountYMm == null || input.spoutProjectionMm == null) {
    return {
      yMm: null,
      insufficientData: true,
      reason: 'Невідома позиція кріплення змішувача або виліт носика — недостатньо даних для розрахунку точки падіння.',
    }
  }
  return { yMm: input.faucetMountYMm + input.spoutProjectionMm, insufficientData: false, reason: null }
}

export interface GeometryResult {
  verdict: Verdict
  landing: LandingPoint
  bowlFrontY: number | null
  message: string
}

/** Does the computed landing point fall within the basin's bowl footprint? */
export function evaluateGeometry(input: GeometryInput): GeometryResult {
  const landing = computeLandingPoint(input)

  if (landing.insufficientData) {
    return {
      verdict: 'unknown',
      landing,
      bowlFrontY: input.bowlDepthMm,
      message: landing.reason ?? 'Недостатньо даних.',
    }
  }

  const y = landing.yMm as number

  if (y < 0) {
    return {
      verdict: 'fail',
      landing,
      bowlFrontY: input.bowlDepthMm,
      message: 'Точка падіння розрахована позаду заднього краю раковини — геометрично неможливе положення.',
    }
  }

  if (input.bowlDepthMm == null) {
    return {
      verdict: 'unknown',
      landing,
      bowlFrontY: null,
      message: 'Глибина чаші невідома — неможливо підтвердити, що струмінь потрапляє в чашу.',
    }
  }

  if (y > input.bowlDepthMm) {
    return {
      verdict: 'fail',
      landing,
      bowlFrontY: input.bowlDepthMm,
      message: 'Точка падіння виходить за передній край чаші — струмінь не потрапляє в раковину.',
    }
  }

  return {
    verdict: 'ok',
    landing,
    bowlFrontY: input.bowlDepthMm,
    message: 'Точка падіння в межах чаші.',
  }
}
