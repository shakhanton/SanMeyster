import { describe, expect, it } from 'vitest'
import { computeTargetZone, evaluateErgonomics, evaluateSpoutHeight } from './ergonomics'

describe('computeTargetZone', () => {
  it('returns unknown basis when bowl depth is not known', () => {
    const zone = computeTargetZone(null)
    expect(zone.basis).toBe('unknown')
    expect(zone.minimumYMm).toBeNull()
  })

  it('computes a heuristic zone 127-254mm inset from the front edge', () => {
    const zone = computeTargetZone(400)
    expect(zone.basis).toBe('heuristic')
    expect(zone.minimumYMm).toBe(400 - 254)
    expect(zone.maximumYMm).toBe(400 - 127)
    expect(zone.preferredYMm).toBe((zone.minimumYMm! + zone.maximumYMm!) / 2)
  })
})

describe('evaluateSpoutHeight', () => {
  it('is unknown when spout height is not known', () => {
    expect(evaluateSpoutHeight(null).verdict).toBe('unknown')
  })

  it('is ok within the 100-200mm comfort range', () => {
    expect(evaluateSpoutHeight(150).verdict).toBe('ok')
  })

  it('warns above the 250mm max splash-drop ceiling', () => {
    expect(evaluateSpoutHeight(300).verdict).toBe('warning')
  })

  it('warns (not fails) below the comfort range — heuristic, never a hard fail', () => {
    const result = evaluateSpoutHeight(67) // real hansgrohe Logis 70 value
    expect(result.verdict).toBe('warning')
  })

  it('is ok for hansgrohe Metris 110 real spec (100mm)', () => {
    expect(evaluateSpoutHeight(100).verdict).toBe('ok')
  })
})

describe('evaluateErgonomics', () => {
  it('is unknown when landing point is unavailable', () => {
    const zone = computeTargetZone(400)
    const result = evaluateErgonomics(null, zone, 150)
    expect(result.landingInZone).toBe('unknown')
  })

  it('is ok when landing point is inside the target zone and spout height is comfortable', () => {
    const zone = computeTargetZone(400) // zone: 146-273
    const result = evaluateErgonomics(200, zone, 150)
    expect(result.landingInZone).toBe('ok')
    expect(result.verdict).toBe('ok')
  })

  it('warns when landing point is outside the target zone', () => {
    const zone = computeTargetZone(400) // zone: 146-273
    const result = evaluateErgonomics(50, zone, 150)
    expect(result.landingInZone).toBe('warning')
    expect(result.verdict).toBe('warning')
  })

  it('never returns fail — heuristic axis only warns', () => {
    const zone = computeTargetZone(400)
    const result = evaluateErgonomics(0, zone, 400)
    expect(result.verdict).not.toBe('fail')
  })
})
