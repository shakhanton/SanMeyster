import { describe, expect, it } from 'vitest'
import { computeLandingPoint, evaluateGeometry } from './geometry'

describe('computeLandingPoint', () => {
  it('adds faucet mount position and spout projection', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.yMm).toBe(128)
    expect(result.insufficientData).toBe(false)
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

  it('defaults to straight-down (0deg) when jetAngleDeg is omitted, matching the original formula', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108, spoutHeightMm: 150 })
    expect(result.yMm).toBe(128)
  })

  it('adds forward drift for a positive jet angle, scaled by spout height', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108, spoutHeightMm: 100, jetAngleDeg: 45 })
    // tan(45deg) = 1, so drift = 100mm
    expect(result.yMm).toBeCloseTo(228, 5)
  })

  it('adds backward drift for a negative jet angle', () => {
    const result = computeLandingPoint({ faucetMountYMm: 100, spoutProjectionMm: 108, spoutHeightMm: 100, jetAngleDeg: -45 })
    expect(result.yMm).toBeCloseTo(108, 5)
  })

  it('ignores jet angle when spout height is unknown (no drop height to scale drift by)', () => {
    const result = computeLandingPoint({ faucetMountYMm: 20, spoutProjectionMm: 108, jetAngleDeg: 45 })
    expect(result.yMm).toBe(128)
  })
})

describe('evaluateGeometry', () => {
  it('returns ok when the landing point is within the bowl', () => {
    const result = evaluateGeometry({ bowlDepthMm: 400, faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('ok')
    expect(result.landing.yMm).toBe(128)
  })

  it('returns fail when the landing point is beyond the front edge of the bowl', () => {
    const result = evaluateGeometry({ bowlDepthMm: 100, faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('fail')
  })

  it('returns fail when the landing point is behind the rear edge (negative Y)', () => {
    const result = evaluateGeometry({ bowlDepthMm: 400, faucetMountYMm: -50, spoutProjectionMm: 20 })
    expect(result.verdict).toBe('fail')
  })

  it('returns unknown when bowl depth is not known, even if a landing point was computed', () => {
    const result = evaluateGeometry({ bowlDepthMm: null, faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('unknown')
    expect(result.landing.yMm).toBe(128)
  })

  it('returns unknown when faucet mount position is missing (insufficient data), not a guess', () => {
    const result = evaluateGeometry({ bowlDepthMm: 400, faucetMountYMm: null, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('unknown')
    expect(result.landing.insufficientData).toBe(true)
  })

  it('handles a landing point exactly on the front edge as ok (boundary case)', () => {
    const result = evaluateGeometry({ bowlDepthMm: 128, faucetMountYMm: 20, spoutProjectionMm: 108 })
    expect(result.verdict).toBe('ok')
  })

  it('handles hansgrohe Logis 70 real spec (spout projection 107mm) with a countertop basin', () => {
    // Real sourced value from research/faucets-raw.md — hansgrohe Logis 70, article 71070000.
    const result = evaluateGeometry({ bowlDepthMm: 470, faucetMountYMm: 10, spoutProjectionMm: 107 })
    expect(result.verdict).toBe('ok')
    expect(result.landing.yMm).toBe(117)
  })
})
