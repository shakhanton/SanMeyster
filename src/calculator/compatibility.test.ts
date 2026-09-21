import { describe, expect, it } from 'vitest'
import { calculate } from './calculator'
import { getBasin, getFaucet } from '../data'
import type { Basin, Faucet } from '../data/types'

function sourced(value: number, overrides: Partial<Basin['depth']> = {}) {
  return {
    value,
    unit: 'mm',
    source: 'test fixture',
    sourceUrl: null,
    verifiedAt: '2026-09-21',
    confidence: 'A' as const,
    ...overrides,
  }
}

function makeBasin(overrides: Partial<Basin> = {}): Basin {
  return {
    id: 'test-basin',
    brand: 'Test',
    manufacturer: 'Test',
    model: 'Test basin',
    articleNumber: null,
    productUrl: null,
    installationType: 'countertop',
    width: sourced(600),
    depth: sourced(470),
    height: sourced(165),
    bowlWidth: null,
    bowlDepth: null,
    bowlHeight: null,
    rearEdgePosition: null,
    frontEdgePosition: null,
    sideEdgePositions: null,
    drainPositionX: null,
    drainPositionY: null,
    drainDiameter: null,
    faucetHole: null,
    faucetHoleCount: null,
    faucetHolePosition: null,
    overflow: null,
    technicalDrawingUrl: null,
    sourceUrl: null,
    verifiedAt: '2026-09-21',
    ...overrides,
  }
}

function makeFaucet(overrides: Partial<Faucet> = {}): Faucet {
  return {
    id: 'test-faucet',
    brand: 'Test',
    model: 'Test faucet',
    articleNumber: null,
    productUrl: null,
    installationType: 'deck-mounted',
    totalHeight: null,
    spoutHeight: sourced(150),
    spoutProjection: sourced(110),
    outletHeight: null,
    outletPosition: null,
    aeratorPosition: null,
    aeratorType: null,
    swivelRange: null,
    installationDimensions: null,
    recommendedBasinTypes: null,
    recommendedBasinModels: null,
    technicalDrawingUrl: null,
    sourceUrl: null,
    verifiedAt: '2026-09-21',
    ...overrides,
  }
}

describe('landing point (real catalog data)', () => {
  it('computes a landing point for hansgrohe Logis 70 on a Villeroy & Boch Subway 3.0 countertop basin', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    // spoutProjection 107mm (research/faucets-raw.md) + mount 10mm
    expect(result.landingYMm).toBe(117)
  })
})

describe('boundary values', () => {
  it('treats landing exactly at the bowl front edge as ok', () => {
    const basin = makeBasin({ depth: sourced(300) })
    const faucet = makeFaucet({ spoutProjection: sourced(300) })
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    expect(result.geometry.verdict).toBe('ok')
  })

  it('treats landing 1mm past the bowl front edge as a geometric fail', () => {
    const basin = makeBasin({ depth: sourced(300) })
    const faucet = makeFaucet({ spoutProjection: sourced(301) })
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    expect(result.geometry.verdict).toBe('fail')
  })
})

describe('different faucet spout heights', () => {
  it('flags hansgrohe Logis 70 (67mm) below the ergonomic comfort range', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(result.ergonomics.spoutHeight.verdict).toBe('warning')
  })

  it('accepts hansgrohe Metris 110 (100mm) within the comfort range', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-metris-110')!
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(result.ergonomics.spoutHeight.verdict).toBe('ok')
  })
})

describe('different spout projections', () => {
  it('produces a different landing point for hansgrohe Focus 100 (119mm) vs Logis 70 (107mm)', () => {
    const basin = getBasin('vb-subway-3-60')!
    const focus = getFaucet('hansgrohe-focus-100')!
    const logis = getFaucet('hansgrohe-logis-70')!
    const focusResult = calculate({ basin, faucet: focus, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    const logisResult = calculate({ basin, faucet: logis, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(focusResult.landingYMm).not.toBe(logisResult.landingYMm)
    expect(focusResult.landingYMm).toBe(129)
  })
})

describe('different bowl depths', () => {
  it('shifts the target zone and can flip geometry from ok to fail as bowl depth shrinks', () => {
    const faucet = makeFaucet({ spoutProjection: sourced(200) })
    const deep = calculate({ basin: makeBasin({ depth: sourced(500) }), faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    const shallow = calculate({ basin: makeBasin({ depth: sourced(150) }), faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    expect(deep.geometry.verdict).toBe('ok')
    expect(shallow.geometry.verdict).toBe('fail')
    expect(deep.targetZone.minimumYMm).not.toBe(shallow.targetZone.minimumYMm)
  })
})

describe('installation types', () => {
  it('calculates successfully for a countertop (накладна) basin', () => {
    const basin = getBasin('vb-subway-3-60')!
    expect(basin.installationType).toBe('countertop')
    const faucet = getFaucet('hansgrohe-logis-100')!
    // Subway 3.0's own bowlDepth (120mm, confidence C) is the binding constraint here,
    // not the outer footprint — mount position kept small so 5 + 108mm projection fits.
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 5, installedBasinHeightMm: 800 })
    expect(result.geometry.verdict).toBe('ok')
  })

  it('calculates successfully for an inset (врізна) basin', () => {
    const basin = getBasin('vb-architectura-built-in-60')!
    expect(basin.installationType).toBe('inset')
    const faucet = getFaucet('hansgrohe-focus-100')!
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 15, installedBasinHeightMm: 800 })
    expect(result.geometry.verdict).toBe('ok')
  })
})

describe('jet lands outside the bowl', () => {
  it('fails geometry when spout projection far exceeds bowl depth', () => {
    const basin = makeBasin({ depth: sourced(400) })
    const faucet = makeFaucet({ spoutProjection: sourced(900) })
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    expect(result.geometry.verdict).toBe('fail')
  })
})

describe('missing required data', () => {
  it('returns unknown geometry/ergonomics and a data-quality warning when faucet mount position is not supplied', () => {
    const basin = getBasin('geberit-icon-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: null, installedBasinHeightMm: 800 })
    expect(result.geometry.verdict).toBe('unknown')
    expect(result.landingYMm).toBeNull()
    expect(result.dataQuality.verdict).toBe('warning')
    expect(result.dataQuality.caveats.some((c) => c.includes('кріплення змішувача'))).toBe(true)
  })

  it('returns unknown standards verdict when basin height is entirely unknown', () => {
    const basin = makeBasin({ height: null })
    const faucet = makeFaucet()
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: null })
    const heightCheck = result.standards.checks.find((c) => c.rule.id === 'ua-basin-height-standard')
    expect(heightCheck?.pass).toBeNull()
  })
})

describe('standards conflicts / jurisdiction profiles are not mixed', () => {
  it('UA standard profile: 800mm passes within tolerance, 850mm fails', () => {
    const basin = makeBasin()
    const faucet = makeFaucet()
    const ok = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    const fail = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 850 })
    expect(ok.standards.verdict).toBe('ok')
    expect(fail.standards.verdict).toBe('fail')
  })

  it('DE accessible profile (≤800mm) accepts 800mm and rejects 850mm — independently of the UA profile', () => {
    const basin = makeBasin() // outer depth 470mm
    const faucet = makeFaucet()
    // faucetMountYMm: 100 keeps the DE ≤400mm faucet-to-front-edge accessible rule
    // satisfied (470-100=370mm) so this test isolates the basin-height boundary only.
    const atLimit = calculate({ basin, faucet, jurisdiction: 'DE', accessible: true, faucetMountYMm: 100, installedBasinHeightMm: 800 })
    const overLimit = calculate({ basin, faucet, jurisdiction: 'DE', accessible: true, faucetMountYMm: 100, installedBasinHeightMm: 850 })
    expect(atLimit.standards.verdict).toBe('ok')
    expect(overLimit.standards.verdict).toBe('fail')
  })

  it('does not apply the documented-but-unused legacy UA accessible rule (500mm) — it is excluded from the engine', () => {
    const basin = makeBasin()
    const faucet = makeFaucet()
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 500 })
    const usedLegacyRule = result.standards.checks.some((c) => c.rule.id === 'ua-basin-height-legacy-accessible')
    expect(usedLegacyRule).toBe(false)
  })
})
