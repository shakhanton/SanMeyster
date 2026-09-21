/**
 * Pure geometry engine. No UI, no data-layer imports — see
 * docs/engineering-model.md §1–2 for the coordinate system and the
 * declared "vertical fall" assumption this module implements.
 */

export type Verdict = 'ok' | 'warning' | 'fail' | 'unknown'

export interface GeometryInput {
  /** Effective bowl depth (bowlDepth, falling back to outer depth) in mm, or null if unknown. */
  bowlDepthMm: number | null
  /** How far the faucet is mounted from the basin's rear edge, in mm — on
   *  the WALL side of that edge (between the basin and the wall), not
   *  inside the bowl. A deck-mounted faucet normally sits behind the basin
   *  it serves, not within its own footprint, so larger values push the
   *  faucet further from the bowl (see computeLandingPoint). */
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
 * water falls vertically from the outlet, so the only horizontal placement
 * that matters is where the outlet itself sits. The outlet sits
 * `spoutProjectionMm` forward of the mount — and the mount itself sits
 * `faucetMountYMm` *behind* the rear edge (toward the wall), not inside the
 * bowl (see `GeometryInput.faucetMountYMm`). So the outlet's position
 * relative to the rear edge (Y=0) is `spoutProjection - faucetMountY`: a
 * faucet mounted further from the basin needs more spout reach just to
 * clear the rear edge at all, before any of that reach lands water inside
 * the bowl. There is no sourced exit angle/velocity to integrate a true
 * trajectory from, so this is a placement, not a ballistic computation.
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
  return { yMm: input.spoutProjectionMm - input.faucetMountYMm + drift, insufficientData: false, reason: null }
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
      message: 'Виліт носика не дотягується навіть до заднього краю раковини — змішувач змонтовано занадто далеко від неї.',
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

export interface ClearanceResult {
  verdict: Verdict
  message: string
}

/**
 * Vertical rim-clearance check. Under the same simplified spout-path model
 * as computeLandingPoint (riser straight up to spoutHeight, then a
 * horizontal run at that constant height, then a vertical drop at the
 * outlet — see docs/engineering-model.md §2), the spout crosses over the
 * basin's rear wall at a constant height equal to `spoutHeightMm` above the
 * mounting surface. If that's at or below the rim height, the spout body
 * physically presses against the basin's exterior wall instead of clearing
 * over the top — a real failure mode independent of the horizontal
 * containment check in evaluateGeometry, and not caught by it: a faucet can
 * have "enough" horizontal reach while still being physically too short to
 * get there. `rimHeightMm` is the rim's height above whatever surface the
 * faucet is mounted on — for a lay-on/countertop or furniture-mounted
 * basin that's the basin's own physical height; for inset/undermount
 * basins the rim sits ~flush with that surface (~0); wall-mounted basins
 * don't share a mounting surface with the faucet in a way this check
 * applies to. Resolving which case applies is the caller's job (see
 * src/calculator/calculator.ts) — this function only compares two heights.
 */
export function evaluateRimClearance(spoutHeightMm: number | null, rimHeightMm: number | null): ClearanceResult {
  if (spoutHeightMm == null || rimHeightMm == null) {
    return {
      verdict: 'unknown',
      message: 'Невідома висота виливу або висота борту раковини — неможливо перевірити вертикальний зазор.',
    }
  }
  if (spoutHeightMm <= rimHeightMm) {
    return {
      verdict: 'fail',
      message: `Висота виливу (${spoutHeightMm} мм) не перевищує висоту борту раковини (${rimHeightMm} мм) — носик фізично впирається в борт, а не перекриває його.`,
    }
  }
  return {
    verdict: 'ok',
    message: `Висота виливу (${spoutHeightMm} мм) перевищує висоту борту раковини (${rimHeightMm} мм) — достатньо, щоб перекрити борт.`,
  }
}
