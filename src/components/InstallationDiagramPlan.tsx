import { useMemo } from 'react'
import { type DiagramData, verdictColor } from './diagram-types'

const VIEW_W = 640
const VIEW_H = 620
const LEFT_MARGIN = 40
const RIGHT_GUTTER = 100 // depth dimension line + label
const TOP_MARGIN = 40
const BOTTOM_GUTTER = 80 // width dimension line + label
const WALL_STRIP = 22

/**
 * Top-down plan view — the primary diagram. Shows the basin footprint as
 * seen from above (the way you'd look at a countertop), so left/right
 * position of the faucet and drain reads directly, instead of being
 * collapsed into a side-profile where that information is invisible.
 */
export default function InstallationDiagramPlan({
  basinWidthMm,
  bowlWidthMm,
  bowlDepthMm,
  faucetMountYMm,
  spoutProjectionMm,
  landingYMm,
  targetZone,
  geometryVerdict,
}: DiagramData) {
  const layout = useMemo(() => {
    const widthMm = Math.max(basinWidthMm ?? 600, 300)
    const depthMm = Math.max(bowlDepthMm ?? 400, landingYMm ?? 0, 200)

    const plotW = VIEW_W - LEFT_MARGIN - RIGHT_GUTTER
    const plotH = VIEW_H - TOP_MARGIN - WALL_STRIP - BOTTOM_GUTTER

    const scale = Math.min(plotW / widthMm, plotH / depthMm)

    const originX = LEFT_MARGIN + (plotW - widthMm * scale) / 2
    const originY = TOP_MARGIN + WALL_STRIP

    const toX = (xMm: number) => originX + xMm * scale
    const toY = (yMm: number) => originY + yMm * scale

    return { widthMm, depthMm, scale, originX, originY, toX, toY }
  }, [basinWidthMm, bowlDepthMm, landingYMm])

  const { widthMm, depthMm, scale, toX, toY } = layout

  const left = toX(0)
  const right = toX(widthMm)
  const rearY = toY(0)
  const frontY = toY(depthMm)
  const centerX = toX(widthMm / 2)

  const bowlW = bowlWidthMm != null ? bowlWidthMm * scale : (right - left) * 0.7
  const bowlLeft = centerX - bowlW / 2
  const bowlRight = centerX + bowlW / 2
  const bowlKnown = bowlWidthMm != null

  const mountY = faucetMountYMm != null ? toY(faucetMountYMm) : null
  const landingY = landingYMm != null ? toY(landingYMm) : null
  // Drain X/Y is unknown for every catalog model (research gap). Shown at
  // the geometric center of the bowl footprint — most wash basins are
  // designed with a center drain — dashed and explicitly labeled "position
  // unknown" rather than implying a measured value.
  const drainCenterY = toY(depthMm * 0.5)

  const zoneMinY = targetZone.minimumYMm != null ? toY(Math.max(targetZone.minimumYMm, 0)) : null
  const zoneMaxY = targetZone.maximumYMm != null ? toY(Math.min(targetZone.maximumYMm, depthMm)) : null

  const color = verdictColor[geometryVerdict]

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Вигляд зверху: розташування змішувача та зливу на стільниці"
      className="w-full h-auto"
    >
      {/* wall strip behind the rear edge */}
      <g>
        <rect x={left - 10} y={rearY - WALL_STRIP} width={right - left + 20} height={WALL_STRIP} fill="#e2e8f0" />
        <text x={(left + right) / 2} y={rearY - WALL_STRIP / 2 + 4} textAnchor="middle" fontSize={11} className="fill-slate-500" style={{ letterSpacing: 1 }}>
          СТІНА
        </text>
      </g>

      {/* basin outer footprint */}
      <rect x={left} y={rearY} width={right - left} height={frontY - rearY} rx={12} fill="#f8fafc" stroke="currentColor" strokeWidth={2.5} className="text-slate-400" />

      {/* bowl interior */}
      <rect
        x={bowlLeft}
        y={rearY + (frontY - rearY) * 0.08}
        width={bowlRight - bowlLeft}
        height={(frontY - rearY) * 0.84}
        rx={10}
        fill="#fff"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeDasharray={bowlKnown ? undefined : '4 3'}
        className="text-slate-300"
      />
      {!bowlKnown && (
        <text x={centerX} y={frontY - 10} textAnchor="middle" fontSize={10} className="fill-slate-400">
          межі чаші невідомі — показано орієнтовно
        </text>
      )}

      {/* target zone */}
      {zoneMinY != null && zoneMaxY != null && (
        <rect x={bowlLeft} y={zoneMinY} width={bowlRight - bowlLeft} height={zoneMaxY - zoneMinY} fill="#22c55e" opacity={0.18} />
      )}

      {/* drain marker */}
      <g opacity={0.75}>
        <circle cx={centerX} cy={drainCenterY} r={9} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="3 2" className="text-slate-400" />
        <circle cx={centerX} cy={drainCenterY} r={2.5} fill="currentColor" className="text-slate-400" />
        <text x={centerX + 16} y={drainCenterY + 4} fontSize={12} fontWeight={600} className="fill-slate-500">
          злив
        </text>
        <text x={centerX + 16} y={drainCenterY + 18} fontSize={9} className="fill-slate-400">
          (точна позиція невідома)
        </text>
      </g>

      {/* faucet mount point */}
      {mountY != null && (
        <g>
          <circle cx={centerX} cy={mountY} r={8} fill="#2563eb" />
          <circle cx={centerX} cy={mountY} r={13} fill="none" stroke="#2563eb" strokeWidth={1.5} opacity={0.4} />
          {/* Label placement: right-of-marker collides with the "СТІНА" wall
              label when the mount is close to the rear edge, so drop below
              the marker in that case instead. */}
          <text
            x={centerX + 20}
            y={mountY - rearY < 28 ? mountY + 26 : mountY + 4}
            textAnchor="start"
            fontSize={12}
            fontWeight={700}
            fill="#2563eb"
          >
            змішувач
          </text>
        </g>
      )}

      {/* line from faucet to landing point (the jet's footprint on the plan) */}
      {mountY != null && landingY != null && (
        <line x1={centerX} y1={mountY} x2={centerX} y2={landingY} stroke={color} strokeWidth={2.5} strokeDasharray="1 6" strokeLinecap="round" />
      )}

      {/* landing point */}
      {landingY != null && (
        <g>
          <circle cx={centerX} cy={landingY} r={7} fill={color} />
          <text x={centerX} y={landingY + 24} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
            точка падіння води
          </text>
        </g>
      )}

      {mountY == null && (
        <text x={VIEW_W / 2} y={TOP_MARGIN} textAnchor="middle" fontSize={13} className="fill-amber-600">
          Вкажіть позицію кріплення змішувача нижче, щоб побачити струмінь
        </text>
      )}

      {/* width dimension */}
      <g fontSize={11} className="fill-slate-500">
        <line x1={left} y1={frontY + 40} x2={right} y2={frontY + 40} stroke="currentColor" className="text-slate-300" />
        <line x1={left} y1={frontY + 36} x2={left} y2={frontY + 44} stroke="currentColor" className="text-slate-300" />
        <line x1={right} y1={frontY + 36} x2={right} y2={frontY + 44} stroke="currentColor" className="text-slate-300" />
        <text x={(left + right) / 2} y={frontY + 56} textAnchor="middle">
          ширина {Math.round(widthMm)} мм
        </text>
      </g>

      {/* depth dimension */}
      <g fontSize={11} className="fill-slate-500">
        <line x1={right + 20} y1={rearY} x2={right + 20} y2={frontY} stroke="currentColor" className="text-slate-300" />
        <line x1={right + 16} y1={rearY} x2={right + 24} y2={rearY} stroke="currentColor" className="text-slate-300" />
        <line x1={right + 16} y1={frontY} x2={right + 24} y2={frontY} stroke="currentColor" className="text-slate-300" />
        <text x={right + 30} y={(rearY + frontY) / 2} dominantBaseline="middle">
          {Math.round(depthMm)} мм
        </text>
      </g>

      <text x={left} y={rearY - WALL_STRIP - 8} fontSize={10} className="fill-slate-400">
        задній край
      </text>
      <text x={left} y={frontY + 20} fontSize={10} className="fill-slate-400">
        передній край (до користувача)
      </text>

      {mountY != null && spoutProjectionMm != null && (
        <text x={centerX + 10} y={(mountY + (landingY ?? mountY)) / 2} fontSize={10} className="fill-slate-400">
          виліт {spoutProjectionMm} мм
        </text>
      )}
    </svg>
  )
}
