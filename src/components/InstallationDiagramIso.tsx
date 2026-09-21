import { useMemo } from 'react'
import { type DiagramData, SCHEMATIC_BOWL_HEIGHT_MM, verdictColor } from './diagram-types'

const VIEW_W = 640
const VIEW_H = 520
const MARGIN = 50
const COS30 = Math.cos(Math.PI / 6)
const SIN30 = Math.sin(Math.PI / 6)

/**
 * Simple isometric "open box" rendering of the basin: bottom face + the two
 * near interior walls, rim drawn as an outline so the inside (drain, landing
 * point) stays visible. Gives spatial intuition without a real 3D engine.
 *
 * The faucet is mounted BEHIND the basin's rear edge (toward the wall, Y<0)
 * — see src/geometry/geometry.ts — not inside its footprint, so the
 * projection's bounding box is fit from the actual set of rendered points
 * (basin + faucet + landing) rather than a fixed formula, since the faucet
 * setback is user-adjustable and can extend well behind the basin.
 */
export default function InstallationDiagramIso({
  basinWidthMm,
  bowlWidthMm,
  bowlDepthMm,
  bowlHeightMm,
  faucetMountYMm,
  spoutHeightMm,
  spoutProjectionMm,
  landingYMm,
  geometryVerdict,
}: DiagramData) {
  const W = Math.max(bowlWidthMm ?? basinWidthMm ?? 500, 250)
  const D = Math.max(bowlDepthMm ?? 400, 200)
  const H = bowlHeightMm ?? SCHEMATIC_BOWL_HEIGHT_MM
  const centerX = W / 2
  const drainY = D * 0.5
  const mountY = faucetMountYMm != null ? -faucetMountYMm : null
  const landingY = landingYMm
  // Outlet position with no jet-angle drift (see InstallationDiagramSide.tsx
  // for the full rationale) — the static riser+reach up to here is fixed by
  // the catalog spec; only the segment from here to `landingY` tilts with
  // the user-set angle.
  const nominalOutletY = spoutProjectionMm != null && faucetMountYMm != null ? spoutProjectionMm - faucetMountYMm : null

  const layout = useMemo(() => {
    const rawProject = (x: number, y: number, z: number) => {
      const sx = (x - y) * COS30
      const sy = (x + y) * SIN30 - z
      return [sx, sy] as const
    }

    const points: Array<readonly [number, number]> = [
      rawProject(0, 0, 0),
      rawProject(W, 0, 0),
      rawProject(W, D, 0),
      rawProject(0, D, 0),
      rawProject(0, 0, -H),
      rawProject(W, 0, -H),
      rawProject(W, D, -H),
      rawProject(0, D, -H),
      rawProject(centerX, drainY, -H),
    ]
    if (mountY != null) {
      points.push(rawProject(centerX, mountY, 0))
      if (spoutHeightMm != null) {
        points.push(rawProject(centerX, mountY, spoutHeightMm))
        if (nominalOutletY != null) points.push(rawProject(centerX, nominalOutletY, spoutHeightMm))
      }
    }
    if (landingY != null) points.push(rawProject(centerX, landingY, 0), rawProject(centerX, landingY, -H * 0.35))

    const minSx = Math.min(...points.map((p) => p[0]))
    const maxSx = Math.max(...points.map((p) => p[0]))
    const minSy = Math.min(...points.map((p) => p[1]))
    const maxSy = Math.max(...points.map((p) => p[1]))

    const boxW = Math.max(maxSx - minSx, 1)
    const boxH = Math.max(maxSy - minSy, 1)
    const scale = Math.min((VIEW_W - MARGIN * 2) / boxW, (VIEW_H - MARGIN * 2) / boxH)

    const originX = VIEW_W / 2 - ((minSx + maxSx) / 2) * scale
    const originY = VIEW_H / 2 - ((minSy + maxSy) / 2) * scale

    const project = (x: number, y: number, z: number) => {
      const [sx, sy] = rawProject(x, y, z)
      return [originX + sx * scale, originY + sy * scale] as const
    }

    return { project }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, D, H, centerX, drainY, mountY, spoutHeightMm, landingY, nominalOutletY])

  const { project } = layout
  const p = (x: number, y: number, z: number) => project(x, y, z).join(',')
  const color = verdictColor[geometryVerdict]

  const bottomFace = [p(0, 0, -H), p(W, 0, -H), p(W, D, -H), p(0, D, -H)].join(' ')
  const frontWall = [p(0, D, 0), p(W, D, 0), p(W, D, -H), p(0, D, -H)].join(' ')
  const rightWall = [p(W, 0, 0), p(W, D, 0), p(W, D, -H), p(W, 0, -H)].join(' ')
  const rimOutline = [p(0, 0, 0), p(W, 0, 0), p(W, D, 0), p(0, D, 0)].join(' ')

  const [drainSx, drainSy] = project(centerX, drainY, -H)
  const [mountSx, mountSy] = mountY != null ? project(centerX, mountY, 0) : [null, null]
  const [spoutTopSx, spoutTopSy] = mountY != null && spoutHeightMm != null ? project(centerX, mountY, spoutHeightMm) : [null, null]
  const [nominalOutletSx, nominalOutletSy] =
    nominalOutletY != null && spoutHeightMm != null ? project(centerX, nominalOutletY, spoutHeightMm) : [null, null]
  const [rimCrossSx, rimCrossSy] = landingY != null ? project(centerX, landingY, 0) : [null, null]
  const [landingSx, landingSy] = landingY != null ? project(centerX, landingY, -H * 0.35) : [null, null]

  // Countertop plane: basin footprint plus margin, extended backward to
  // cover wherever the faucet actually sits.
  const backY = Math.min(-30, (mountY ?? 0) - 30)

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Ізометрична схема встановлення раковини та змішувача"
      className="w-full h-auto"
    >
      {/* countertop plane — same tone as the plan/side views, distinct from the basin */}
      <polygon
        points={[project(-40, backY, 0), project(W + 40, backY, 0), project(W + 40, D + 20, 0), project(-40, D + 20, 0)].map((pt) => pt.join(',')).join(' ')}
        fill="#d8dee6"
        stroke="#94a3b8"
      />
      {(() => {
        const [lx, ly] = project(W * 0.05, backY + 15, 0)
        return (
          <text x={lx} y={ly} fontSize={10} fontWeight={600} className="fill-slate-600">
            стільниця
          </text>
        )
      })()}

      {/* bowl bottom (floor) */}
      <polygon points={bottomFace} fill="#eff6ff" stroke="currentColor" strokeWidth={1.5} className="text-slate-400" />
      {/* interior walls */}
      <polygon points={frontWall} fill="#e4edfa" stroke="currentColor" strokeWidth={1.5} className="text-slate-400" />
      <polygon points={rightWall} fill="#dbe6f5" stroke="currentColor" strokeWidth={1.5} className="text-slate-400" />
      {/* rim outline */}
      <polygon points={rimOutline} fill="none" stroke="currentColor" strokeWidth={2.5} className="text-slate-500" />

      {/* drain marker on the bowl floor */}
      <g opacity={0.8}>
        <ellipse cx={drainSx} cy={drainSy} rx={10} ry={5} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="3 2" className="text-slate-400" />
        <text x={drainSx + 16} y={drainSy + 4} fontSize={12} fontWeight={600} className="fill-slate-500">
          злив
        </text>
        <text x={drainSx + 16} y={drainSy + 17} fontSize={9} className="fill-slate-400">
          (позиція невідома)
        </text>
      </g>

      {/* faucet riser + static reach (solid, fixed by the catalog spec) +
          angled jet (dashed — its slope is the actual jetAngleDeg the user
          set; straight down when 0°) — see InstallationDiagramSide.tsx */}
      {mountSx != null && mountSy != null && spoutTopSx != null && spoutTopSy != null && (
        <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round">
          <line x1={mountSx} y1={mountSy} x2={spoutTopSx} y2={spoutTopSy} />
          {nominalOutletSx != null && nominalOutletSy != null && (
            <line x1={spoutTopSx} y1={spoutTopSy} x2={nominalOutletSx} y2={nominalOutletSy} />
          )}
          {nominalOutletSx != null && nominalOutletSy != null && rimCrossSx != null && rimCrossSy != null && (
            <line x1={nominalOutletSx} y1={nominalOutletSy} x2={rimCrossSx} y2={rimCrossSy} strokeDasharray="6 4" />
          )}
          {rimCrossSx != null && rimCrossSy != null && landingSx != null && landingSy != null && (
            <line x1={rimCrossSx} y1={rimCrossSy} x2={landingSx} y2={landingSy} strokeDasharray="2 4" opacity={0.5} />
          )}
          <circle cx={mountSx} cy={mountSy} r={5} fill="#2563eb" stroke="none" />
        </g>
      )}
      {mountSx != null && mountSy != null && (
        <text x={mountSx} y={mountSy + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">
          змішувач
        </text>
      )}
      {landingSx != null && landingSy != null && (
        <g>
          <circle cx={landingSx} cy={landingSy} r={6} fill={color} />
          <text x={landingSx} y={landingSy - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
            точка падіння
          </text>
        </g>
      )}

      {mountY == null && (
        <text x={VIEW_W / 2} y={30} textAnchor="middle" fontSize={13} className="fill-amber-600">
          Вкажіть позицію кріплення змішувача нижче, щоб побачити струмінь
        </text>
      )}

      {spoutProjectionMm != null && mountSx != null && (
        <text x={mountSx + 20} y={(mountSy ?? 0) - (spoutTopSy != null ? (mountSy! - spoutTopSy) / 2 : 0)} fontSize={10} className="fill-slate-400">
          виліт {spoutProjectionMm} мм
        </text>
      )}
    </svg>
  )
}
