import type { Basin, Faucet, InstallationType } from '../data/types'
import { basins, faucets } from '../data'

export interface BasinFilters {
  brand?: string
  installationType?: InstallationType
  query?: string
}

export function searchBasins(filters: BasinFilters): Basin[] {
  return basins.filter((b) => {
    if (filters.brand && b.brand !== filters.brand) return false
    if (filters.installationType && b.installationType !== filters.installationType) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const haystack = `${b.brand} ${b.model} ${b.articleNumber ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export interface FaucetFilters {
  brand?: string
  query?: string
}

export function searchFaucets(filters: FaucetFilters): Faucet[] {
  return faucets.filter((f) => {
    if (filters.brand && f.brand !== filters.brand) return false
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const haystack = `${f.brand} ${f.model} ${f.articleNumber ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export const basinBrands = Array.from(new Set(basins.map((b) => b.brand))).sort()
export const faucetBrands = Array.from(new Set(faucets.map((f) => f.brand))).sort()
export const installationTypes: InstallationType[] = ['countertop', 'inset', 'undermount', 'wall-mounted', 'furniture']
