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
  /** Drop height from outlet to rim, mm. Only used to scale the jet-angle
   *  drift below — optional because most callers don't need it. */
  spoutHeightMm?: number | null
  /** Jet exit angle from vertical, degrees; positive tilts toward the front
   *  edge. No source publishes this for any researched faucet (see
   *  docs/engineering-model.md §2) — it is always a user-supplied what-if
   *  value, defaulting to 0 (straight down, Assumption A unchanged). */
  jetAngleDeg?: number
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
 *
 * `jetAngleDeg` extends this with an optional user-supplied "what if the
 * stream isn't perfectly vertical" adjustment: a straight-line drift of
 * `spoutHeightMm * tan(angle)`, added toward the front edge for a positive
 * angle. This is a geometric extrapolation, not physics — it ignores
 * gravity's acceleration and the jet's actual velocity (still unsourced for
 * every researched faucet) — so it's only ever as good as the angle the
 * user enters. Defaults to 0° (straight down), which reduces to the
 * original formula exactly.
 */
export function computeLandingPoint(
  input: Pick<GeometryInput, 'faucetMountYMm' | 'spoutProjectionMm' | 'spoutHeightMm' | 'jetAngleDeg'>,
): LandingPoint {
  if (input.faucetMountYMm == null || input.spoutProjectionMm == null) {
    return {
      yMm: null,
      insufficientData: true,
      reason: 'Невідома позиція кріплення змішувача або виліт носика — недостатньо даних для розрахунку точки падіння.',
    }
  }
  const angleRad = ((input.jetAngleDeg ?? 0) * Math.PI) / 180
  const drift = (input.spoutHeightMm ?? 0) * Math.tan(angleRad)
  return { yMm: input.faucetMountYMm + input.spoutProjectionMm + drift, insufficientData: false, reason: null }
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
