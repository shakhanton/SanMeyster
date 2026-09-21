import basinsJson from './basins.json'
import faucetsJson from './faucets.json'
import standardsJson from './standards.json'
import manufacturersJson from './manufacturers.json'
import type { Basin, Faucet, StandardRule, Manufacturer } from './types'

export const basins: Basin[] = basinsJson as Basin[]
export const faucets: Faucet[] = faucetsJson as Faucet[]
export const standards: StandardRule[] = standardsJson as StandardRule[]
export const manufacturers: Manufacturer[] = manufacturersJson as Manufacturer[]

export function getBasin(id: string): Basin | undefined {
  return basins.find((b) => b.id === id)
}

export function getFaucet(id: string): Faucet | undefined {
  return faucets.find((f) => f.id === id)
}

export function standardsForJurisdiction(jurisdiction: StandardRule['jurisdiction']): StandardRule[] {
  return standards.filter((s) => s.jurisdiction === jurisdiction && s.usedInEngine)
}

export * from './types'
