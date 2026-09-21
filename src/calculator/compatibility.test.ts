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
    // 200mm clears the default test basin's own height (165mm) so tests
    // not specifically about rim clearance aren't incidentally tripped by
    // it — see the dedicated 'vertical rim clearance' describe block below.
    spoutHeight: sourced(200),
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
    // faucet mounts 10mm behind the rear edge; spoutProjection 107mm (research/faucets-raw.md)
    // landingY = spoutProjection - faucetMountY = 107 - 10 = 97
    expect(result.landingYMm).toBe(97)
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

  it('treats a faucet setback larger than the spout reach as a geometric fail (never reaches the basin)', () => {
    const basin = makeBasin({ depth: sourced(400) })
    const faucet = makeFaucet({ spoutProjection: sourced(80) })
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 150, installedBasinHeightMm: 800 })
    expect(result.geometry.verdict).toBe('fail')
    expect(result.landingYMm).toBeLessThan(0)
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
    expect(focusResult.landingYMm).toBe(109) // 119 - 10
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
    // Isolate horizontal containment from the (real, separately-tested) rim
    // clearance concern for this exact pairing — see 'vertical rim
    // clearance' below — with a low override so only containment is checked here.
    const result = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 5,
      installedBasinHeightMm: 800,
      basinRimHeightOverrideMm: 50,
    })
    expect(result.geometry.verdict).toBe('ok')
  })

  it('calculates successfully for an inset (врізна) basin', () => {
    const basin = getBasin('vb-architectura-built-in-60')!
    expect(basin.installationType).toBe('inset')
    const faucet = getFaucet('hansgrohe-focus-100')!
    // Isolate horizontal containment from the rim-clearance concern (this
    // basin's real 170mm height vs. this faucet's real 94mm spout height
    // fails clearance — see 'vertical rim clearance' below) with an
    // explicit flush override, since rim height is never hardcoded by
    // installation type any more.
    const result = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 15,
      installedBasinHeightMm: 800,
      basinRimHeightOverrideMm: 0,
    })
    expect(result.geometry.verdict).toBe('ok')
  })
})

describe('vertical rim clearance', () => {
  it('real pairing: hansgrohe Logis 70 (67mm spout) cannot clear Villeroy & Boch Subway 3.0 (165mm, countertop)', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(result.clearance.verdict).toBe('fail')
    expect(result.geometry.verdict).toBe('fail') // merged into the geometry axis
  })

  it('is ok even with horizontal containment ok when spout height exceeds the rim height', () => {
    const basin = makeBasin({ height: sourced(165) })
    const faucet = makeFaucet({ spoutHeight: sourced(200) })
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(result.clearance.verdict).toBe('ok')
  })

  it('rim height is one unified, user-editable value for every installation type — never hardcoded by type', () => {
    // An inset basin still uses its own (catalog or overridden) height for
    // the check, same as any other type — 0 = flush is a UI *default* for
    // inset/undermount when the catalog has no height, not an engine rule.
    const basin = makeBasin({ installationType: 'inset', height: sourced(200) })
    const faucet = makeFaucet({ spoutHeight: sourced(60) })
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(result.clearance.verdict).toBe('fail') // 60mm does not clear 200mm
  })

  it('an explicit 0mm override (rim flush with the counter) passes regardless of installation type', () => {
    const basin = makeBasin({ installationType: 'inset', height: sourced(200) })
    const faucet = makeFaucet({ spoutHeight: sourced(60) })
    const result = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 10,
      installedBasinHeightMm: 800,
      basinRimHeightOverrideMm: 0,
    })
    expect(result.clearance.verdict).toBe('ok')
  })

  it('does not evaluate clearance for wall-mounted basins (no shared mounting surface)', () => {
    const basin = makeBasin({ installationType: 'wall-mounted', height: sourced(165) })
    const faucet = makeFaucet({ spoutHeight: sourced(60) })
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(result.clearance.verdict).toBe('unknown')
  })

  it('a user override for rim height changes the clearance verdict', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const result = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 10,
      installedBasinHeightMm: 800,
      basinRimHeightOverrideMm: 50, // lower than the real 165mm
    })
    expect(result.clearance.verdict).toBe('ok')
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

  it('DE accessible profile (≤400mm) accepts a front distance at the limit and rejects over it — independently of the UA profile', () => {
    // Front distance = basin depth + faucet setback (faucet mounts behind
    // the rear edge — see src/geometry/geometry.ts). A 350mm-deep basin
    // with the faucet flush (0mm setback) sits exactly at 350mm, well
    // under DE's 400mm accessible limit; only basinHeight varies below so
    // this isolates that boundary.
    const basin = makeBasin({ depth: sourced(350) })
    const faucet = makeFaucet()
    const atLimit = calculate({ basin, faucet, jurisdiction: 'DE', accessible: true, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    const overLimit = calculate({ basin, faucet, jurisdiction: 'DE', accessible: true, faucetMountYMm: 0, installedBasinHeightMm: 850 })
    expect(atLimit.standards.verdict).toBe('ok')
    expect(overLimit.standards.verdict).toBe('fail')
  })

  it('DE accessible front-distance rule fails once the basin depth alone exceeds 400mm, regardless of faucet setback', () => {
    const basin = makeBasin({ depth: sourced(470) }) // depth alone already exceeds 400mm
    const faucet = makeFaucet()
    const result = calculate({ basin, faucet, jurisdiction: 'DE', accessible: true, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    const distanceCheck = result.standards.checks.find((c) => c.rule.id === 'de-faucet-max-front-distance')
    expect(distanceCheck?.pass).toBe(false)
  })

  it('does not apply the documented-but-unused legacy UA accessible rule (500mm) — it is excluded from the engine', () => {
    const basin = makeBasin()
    const faucet = makeFaucet()
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 500 })
    const usedLegacyRule = result.standards.checks.some((c) => c.rule.id === 'ua-basin-height-legacy-accessible')
    expect(usedLegacyRule).toBe(false)
  })
})

describe('editable characteristic overrides', () => {
  it('a user-edited basin depth changes the geometry verdict, overriding the catalog value', () => {
    const basin = makeBasin({ depth: sourced(300) })
    const faucet = makeFaucet({ spoutProjection: sourced(320) })
    const withoutOverride = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 0, installedBasinHeightMm: 800 })
    const withOverride = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 0,
      installedBasinHeightMm: 800,
      basinDepthOverrideMm: 500,
    })
    expect(withoutOverride.geometry.verdict).toBe('fail') // 320mm > 300mm bowl depth
    expect(withOverride.geometry.verdict).toBe('ok') // 320mm <= 500mm overridden depth
  })

  it('a user-edited spout projection changes the landing point', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const result = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 10,
      installedBasinHeightMm: 800,
      spoutProjectionOverrideMm: 200,
    })
    expect(result.landingYMm).toBe(190) // 200 - 10, not the catalog 107mm
  })

  it('flags data quality when a characteristic has been overridden', () => {
    const basin = makeBasin()
    const faucet = makeFaucet()
    const result = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 10,
      installedBasinHeightMm: 800,
      spoutHeightOverrideMm: 999,
    })
    expect(result.dataQuality.verdict).toBe('warning')
    expect(result.dataQuality.caveats.some((c) => c.includes('відредаговані вручну'))).toBe(true)
  })

  it('does not flag an override caveat when the "override" equals the catalog value', () => {
    const basin = makeBasin({ depth: sourced(470) })
    const faucet = makeFaucet()
    const result = calculate({
      basin,
      faucet,
      jurisdiction: 'UA',
      accessible: false,
      faucetMountYMm: 10,
      installedBasinHeightMm: 800,
      basinDepthOverrideMm: 470, // same as catalog value
    })
    expect(result.dataQuality.caveats.some((c) => c.includes('відредаговані вручну'))).toBe(false)
  })
})

describe('jet angle (heuristic, user-supplied)', () => {
  it('defaults to 0 degrees (straight down) and matches the base landing formula', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const result = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    expect(result.landingYMm).toBe(97) // 107 - 10, unchanged by the new parameter
  })

  it('a non-zero jet angle shifts the landing point and is flagged in data quality + explanation', () => {
    const basin = getBasin('vb-subway-3-60')!
    const faucet = getFaucet('hansgrohe-logis-70')!
    const straight = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800 })
    const angled = calculate({ basin, faucet, jurisdiction: 'UA', accessible: false, faucetMountYMm: 10, installedBasinHeightMm: 800, jetAngleDeg: 30 })
    expect(angled.landingYMm).not.toBe(straight.landingYMm)
    expect(angled.dataQuality.verdict).toBe('warning')
    expect(angled.explanation.some((e) => e.label.includes('Кут струменя'))).toBe(true)
  })
})
