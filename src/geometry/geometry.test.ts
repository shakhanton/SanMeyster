import { describe, expect, it } from 'vitest'
import { computeLandingPoint, evaluateGeometry, evaluateRimClearance } from './geometry'

describe('computeLandingPoint', () => {
  it('subtracts the faucet setback (mount is behind the rear edge) from spout projection', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.yMm).toBe(88)
    expect(result.insufficientData).toBe(false)
  })

  it('a zero setback (faucet mounted flush with the rear edge) reduces to landingY = spoutProjection', () => {
    const result = computeLandingPoint({ faucetMountYMm: 0, spoutProjectionMm: 107 })
    expect(result.yMm).toBe(107)
  })

  it('a setback larger than the spout reach lands behind the rear edge (negative Y)', () => {
    const result = computeLandingPoint({ faucetMountYMm: 150, spoutProjectionMm: 108 })
    expect(result.yMm).toBe(-42)
  })

  it('flags insufficient data when faucet mount position is unknown', () => {
    const result = computeLandingPoint({ faucetMountYMm: null, spoutProjectionMm: 108 })
    expect(result.insufficientData).toBe(true)
    expect(result.yMm).toBeNull()
  })

  it('flags insufficient data when spout projection is unknown', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: null })
    expect(result.insufficientData).toBe(true)
    expect(result.yMm).toBeNull()
  })

  it('defaults to straight-down (0deg) when jetAngleDeg is omitted, matching the base formula', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108, spoutHeightMm: 150 })
    expect(result.yMm).toBe(88)
  })

  it('adds forward drift for a positive jet angle, scaled by spout height', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108, spoutHeightMm: 100, jetAngleDeg: 45 })
    // tan(45deg) = 1, so drift = 100mm
    expect(result.yMm).toBeCloseTo(188, 5)
  })

  it('adds backward drift for a negative jet angle', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108, spoutHeightMm: 100, jetAngleDeg: -45 })
    expect(result.yMm).toBeCloseTo(-12, 5)
  })

  it('ignores jet angle when spout height is unknown (no drop height to scale drift by)', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108, jetAngleDeg: 45 })
    expect(result.yMm).toBe(88)
  })
})

describe('evaluateGeometry', () => {
  it('returns ok when the landing point is within the bowl', () => {
    const result = evaluateGeometry({ bowlDepthMm: 400, faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('ok')
    expect(result.landing.yMm).toBe(88)
  })

  it('returns fail when the landing point is beyond the front edge of the bowl', () => {
    const result = evaluateGeometry({ bowlDepthMm: 50, faucetMountYMm: 0, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('fail')
  })

  it('returns fail when the faucet setback exceeds the spout reach (lands behind the rear edge)', () => {
    const result = evaluateGeometry({ bowlDepthMm: 400, faucetMountYMm: 150, spoutProjectionMm: 20 })
    expect(result.verdict).toBe('fail')
    expect(result.landing.yMm).toBeLessThan(0)
  })

  it('returns unknown when bowl depth is not known, even if a landing point was computed', () => {
    const result = evaluateGeometry({ bowlDepthMm: null, faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('unknown')
    expect(result.landing.yMm).toBe(88)
  })

  it('returns unknown when faucet mount position is missing (insufficient data), not a guess', () => {
    const result = evaluateGeometry({ bowlDepthMm: 400, faucetMountYMm: null, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('unknown')
    expect(result.landing.insufficientData).toBe(true)
  })

  it('handles a landing point exactly on the front edge as ok (boundary case)', () => {
    const result = evaluateGeometry({ bowlDepthMm: 88, faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('ok')
  })

  it('handles hansgrohe Logis 70 real spec (spout projection 107mm) with a countertop basin', () => {
    // Real sourced value from research/faucets-raw.md — hansgrohe Logis 70, article 71070000.
    const result = evaluateGeometry({ bowlDepthMm: 470, faucetMountYMm: 10, spoutProjectionMm: 107 })
    expect(result.verdict).toBe('ok')
    expect(result.landing.yMm).toBe(97)
  })

  it('a faucet mounted right at the rear edge (0mm setback) with a short spout still reaches the bowl', () => {
    const result = evaluateGeometry({ bowlDepthMm: 470, faucetMountYMm: 0, spoutProjectionMm: 107 })
    expect(result.verdict).toBe('ok')
    expect(result.landing.yMm).toBe(107)
  })
})

describe('evaluateRimClearance', () => {
  it('is unknown when either input is missing', () => {
    expect(evaluateRimClearance(null, 165).verdict).toBe('unknown')
    expect(evaluateRimClearance(94, null).verdict).toBe('unknown')
  })

  it('fails when spout height does not exceed the rim height — spout cannot clear the basin wall', () => {
    // Real case: hansgrohe Logis 70 (spoutHeight 67mm) on Villeroy & Boch
    // Subway 3.0 (own height 165mm) as a countertop basin — the spout is
    // far too short to clear that rim.
    const result = evaluateRimClearance(67, 165)
    expect(result.verdict).toBe('fail')
  })

  it('is ok when spout height exceeds the rim height', () => {
    const result = evaluateRimClearance(200, 165)
    expect(result.verdict).toBe('ok')
  })

  it('fails on exact equality (no clearance margin) rather than defaulting to ok', () => {
    const result = evaluateRimClearance(165, 165)
    expect(result.verdict).toBe('fail')
  })
})
