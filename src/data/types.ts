/**
 * Core data model for SanMeyster.
 *
 * Every measured/sourced fact in the catalog and rule set is wrapped in
 * `Sourced<T>` so the UI can always answer "where does this number come
 * from?". A field with no reliable source is `null`, never a guessed value
 * (see docs/ergonomics-and-standards.md and research/*.md).
 */

/** How confident we are in a sourced value. */
export type Confidence = 'A' | 'B' | 'C'
// A = seen directly on an official manufacturer/standard document
// B = manufacturer's own figure, corroborated by >=2 independent sources
// C = single source, unconfirmed

export interface Sourced<T> {
  value: T
  unit: string | null
  source: string | null
  sourceUrl: string | null
  verifiedAt: string | null // ISO date
  confidence: Confidence | null
}

/** A sourced value that may genuinely be unknown. */
export type Maybe<T> = Sourced<T> | { value: null }

export type InstallationType =
  | 'countertop' // накладна
  | 'inset' // врізна
  | 'undermount' // підстільна (undercounter)
  | 'wall-mounted' // настінна
  | 'furniture' // меблева/консольна

export type FaucetInstallationType = 'deck-mounted' | 'wall-mounted'

/** Regulatory/ergonomic rule classification — see instructions section 10. */
export type RuleType =
  | 'mandatory' // binding regulatory requirement
  | 'recommended' // non-binding recommendation from a standard/professional body
  | 'ergonomic' // ergonomic/usability guidance
  | 'manufacturer' // manufacturer's own recommendation
  | 'calculated' // derived from geometry/physics, not a cited value
  | 'heuristic' // engineering judgement call, explicitly flagged as such

export type Jurisdiction =
  | 'UA'
  | 'EU'
  | 'DE'
  | 'ISO'
  | 'professional'
  | 'manufacturer'

export interface Basin {
  id: string
  brand: string
  manufacturer: string
  model: string
  articleNumber: string | null
  productUrl: string | null
  installationType: InstallationType

  width: Sourced<number> | null // mm, outer
  depth: Sourced<number> | null // mm, outer
  height: Sourced<number> | null // mm, outer

  bowlWidth: Sourced<number> | null
  bowlDepth: Sourced<number> | null
  bowlHeight: Sourced<number> | null // internal bowl depth/height

  rearEdgePosition: Sourced<number> | null // mm from a defined reference, if known
  frontEdgePosition: Sourced<number> | null
  sideEdgePositions: Sourced<[number, number]> | null

  drainPositionX: Sourced<number> | null
  drainPositionY: Sourced<number> | null
  drainDiameter: Sourced<number> | null

  faucetHole: Sourced<boolean> | null
  faucetHoleCount: Sourced<number> | null
  faucetHolePosition: Sourced<number> | null // distance from rear edge, mm

  overflow: Sourced<boolean> | null

  technicalDrawingUrl: string | null
  sourceUrl: string | null
  verifiedAt: string | null
}

export interface Faucet {
  id: string
  brand: string
  model: string
  articleNumber: string | null
  productUrl: string | null
  installationType: FaucetInstallationType

  totalHeight: Sourced<number> | null // mm
  spoutHeight: Sourced<number> | null // mm, outlet above mounting surface
  spoutProjection: Sourced<number> | null // mm, horizontal reach
  outletHeight: Sourced<number> | null
  outletPosition: Sourced<number> | null
  aeratorPosition: Sourced<number> | null
  aeratorType: Sourced<string> | null
  swivelRange: Sourced<number> | null // degrees

  installationDimensions: Sourced<string> | null
  recommendedBasinTypes: InstallationType[] | null
  recommendedBasinModels: string[] | null

  technicalDrawingUrl: string | null
  sourceUrl: string | null
  verifiedAt: string | null
}

/**
 * A rule's value as actually published — often a range, a one-sided bound
 * (≤/≥), or a tolerance, not a single number. `raw` preserves the source's
 * own notation for display; min/max/nominal are the parsed numeric bounds
 * used by the calculation engine (whichever apply — a "≤300" rule has only
 * `max`, an "800" rule has all three equal).
 */
export interface RuleValue {
  raw: string
  min: number | null
  max: number | null
  nominal: number | null
}

export interface StandardRule {
  id: string
  parameter: string
  value: RuleValue
  unit: string
  type: RuleType
  jurisdiction: Jurisdiction
  source: string
  section: string | null
  url: string | null
  dateAccessed: string
  /** Does this rule feed the compatibility engine, or is it reference-only
   * (e.g. room dimensions, mirror height) not used in geometry checks? */
  usedInEngine: boolean
  notes: string | null
}

export interface Manufacturer {
  id: string
  name: string
  website: string | null
}
