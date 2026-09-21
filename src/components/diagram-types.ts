export type Verdict = 'ok' | 'warning' | 'fail' | 'unknown'

export interface DiagramData {
  basinWidthMm: number | null
  bowlWidthMm: number | null
  /** Effective bowl depth used for containment (bowlDepth ?? outer depth), mm. */
  bowlDepthMm: number | null
  /** Bowl indentation depth below the rim, mm. Falls back to a schematic default when unknown. */
  bowlHeightMm: number | null
  faucetMountYMm: number | null
  spoutHeightMm: number | null
  spoutProjectionMm: number | null
  landingYMm: number | null
  targetZone: { minimumYMm: number | null; maximumYMm: number | null }
  geometryVerdict: Verdict
}

/** Visual-only fallback when bowlHeight is unknown; never used in calculations. */
export const SCHEMATIC_BOWL_HEIGHT_MM = 120

export const verdictColor: Record<Verdict, string> = {
  ok: '#16a34a',
  warning: '#d97706',
  fail: '#dc2626',
  unknown: '#64748b',
}
