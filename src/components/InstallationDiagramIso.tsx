import { useMemo } from 'react'
import { type DiagramData, SCHEMATIC_BOWL_HEIGHT_MM, verdictColor } from './diagram-types'

const VIEW_W = 640
const VIEW_H = 520
const COS30 = Math.cos(Math.PI / 6)
const SIN30 = Math.sin(Math.PI / 6)

/**
 * Simple isometric "open box" rendering of the basin: bottom face + the two
 * near interior walls, rim drawn as an outline so the inside (drain, landing
 * point) stays visible. Gives spatial intuition without a real 3D engine.
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
  const model = useMemo(() => {
    const W = Math.max(bowlWidthMm ?? basinWidthMm ?? 500, 250)
    const D = Math.max(bowlDepthMm ?? 400, landingYMm ?? 0, 200)
    const H = bowlHeightMm ?? SCHEMATIC_BOWL_HEIGHT_MM

    // Fit the projected bounding box into the viewport.
    const rawSpan = (W + D) * COS30
    const rawHeight = (W + D) * SIN30 + H + (spoutHeightMm ?? 150) + 60
    const scale = Math.min((VIEW_W - 80) / rawSpan, (VIEW_H - 100) / rawHeight)

    const originX = VIEW_W / 2
    const originY = 90 + (spoutHeightMm ?? 150) * scale

    const project = (x: number, y: number, z: number) => {
      const sx = (x - y) * COS30 * scale
      const sy = (x + y) * SIN30 * scale - z * scale
      return [originX + sx, originY + sy] as const
    }

    return { W, D, H, scale, project }
  }, [basinWidthMm, bowlWidthMm, bowlDepthMm, bowlHeightMm, spoutHeightMm, landingYMm])

  const { W, D, H, project } = model
  const p = (x: number, y: number, z: number) => project(x, y, z).join(',')

  const centerX = W / 2
  const drainY = D * 0.62
  const mountY = faucetMountYMm
  const landingY = landingYMm
  const color = verdictColor[geometryVerdict]

  const bottomFace = [p(0, 0, -H), p(W, 0, -H), p(W, D, -H), p(0, D, -H)].join(' ')
  const frontWall = [p(0, D, 0), p(W, D, 0), p(W, D, -H), p(0, D, -H)].join(' ')
  const rightWall = [p(W, 0, 0), p(W, D, 0), p(W, D, -H), p(W, 0, -H)].join(' ')
  const rimOutline = [p(0, 0, 0), p(W, 0, 0), p(W, D, 0), p(0, D, 0)].join(' ')

  const [drainSx, drainSy] = project(centerX, drainY, -H)
  const [mountSx, mountSy] = mountY != null ? project(centerX, mountY, 0) : [null, null]
  const [spoutTopSx, spoutTopSy] = mountY != null && spoutHeightMm != null ? project(centerX, mountY, spoutHeightMm) : [null, null]
  const [landingSx, landingSy] = landingY != null ? project(centerX, landingY, -H * 0.35) : [null, null]

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Ізометрична схема встановлення раковини та змішувача"
      className="w-full h-auto"
    >
      {/* countertop plane, slightly larger than the basin footprint */}
      <polygon
        points={[project(-40, -30, 0), project(W + 40, -30, 0), project(W + 40, D + 20, 0), project(-40, D + 20, 0)].map((pt) => pt.join(',')).join(' ')}
        fill="#f1f5f9"
        stroke="#e2e8f0"
      />

      {/* bowl bottom (floor) */}
      <polygon points={bottomFace} fill="#f8fafc" stroke="currentColor" strokeWidth={1.5} className="text-slate-300" />
      {/* interior walls */}
      <polygon points={frontWall} fill="#eef2f7" stroke="currentColor" strokeWidth={1.5} className="text-slate-300" />
      <polygon points={rightWall} fill="#e4e9f0" stroke="currentColor" strokeWidth={1.5} className="text-slate-300" />
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

      {/* faucet riser + spout + landing */}
      {mountSx != null && mountSy != null && spoutTopSx != null && spoutTopSy != null && (
        <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round">
          <line x1={mountSx} y1={mountSy} x2={spoutTopSx} y2={spoutTopSy} />
          {landingSx != null && landingSy != null && <path d={`M ${spoutTopSx} ${spoutTopSy} Q ${landingSx} ${spoutTopSy} ${landingSx} ${landingSy}`} />}
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
