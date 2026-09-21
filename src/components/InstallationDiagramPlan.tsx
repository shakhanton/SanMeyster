import { useMemo } from 'react'
import { type DiagramData, verdictColor } from './diagram-types'

const VIEW_W = 640
const VIEW_H = 640
const LEFT_MARGIN = 40
const RIGHT_GUTTER = 100 // depth dimension line + label
const TOP_MARGIN = 40
const BOTTOM_GUTTER = 80 // width dimension line + label
const WALL_BAND_PX = 18 // decorative only — the wall itself has no modeled thickness
const BEHIND_MARGIN_MM = 20 // headroom behind whichever point sits furthest from the basin

/**
 * Top-down plan view — the primary diagram. Shows the basin footprint as
 * seen from above, plus the countertop strip behind it where the faucet
 * actually sits: a deck-mounted faucet is mounted BETWEEN the wall and the
 * basin's rear edge, not inside the bowl (see
 * src/geometry/geometry.ts — GeometryInput.faucetMountYMm). Both the basin
 * and this countertop gap are drawn to the same real mm scale, so the
 * distance from the edge to the wall reads directly instead of being
 * implied.
 */
export default function InstallationDiagramPlan({
  basinWidthMm,
  bowlDepthMm,
  faucetMountYMm,
  spoutProjectionMm,
  landingYMm,
  targetZone,
  geometryVerdict,
}: DiagramData) {
  const layout = useMemo(() => {
    const widthMm = Math.max(basinWidthMm ?? 600, 300)
    const depthMm = Math.max(bowlDepthMm ?? 400, 200)
    const mountValMm = faucetMountYMm ?? 0
    const landingValMm = landingYMm ?? 0

    // Y=0 is the basin's rear edge. Negative Y is the countertop strip
    // between the wall and that edge, where the faucet mounts.
    const topYMm = Math.min(-mountValMm, landingValMm, 0) - BEHIND_MARGIN_MM
    const bottomYMm = Math.max(depthMm, landingValMm)

    const plotW = VIEW_W - LEFT_MARGIN - RIGHT_GUTTER
    const plotH = VIEW_H - TOP_MARGIN - WALL_BAND_PX - BOTTOM_GUTTER

    const scale = Math.min(plotW / widthMm, plotH / (bottomYMm - topYMm))

    const originX = LEFT_MARGIN + (plotW - widthMm * scale) / 2
    const originY = TOP_MARGIN + WALL_BAND_PX

    const toX = (xMm: number) => originX + xMm * scale
    const toY = (yMm: number) => originY + (yMm - topYMm) * scale

    return { widthMm, depthMm, topYMm, toX, toY }
  }, [basinWidthMm, bowlDepthMm, faucetMountYMm, landingYMm])

  const { widthMm, depthMm, topYMm, toX, toY } = layout

  const left = toX(0)
  const right = toX(widthMm)
  const wallY = toY(topYMm)
  const rearY = toY(0)
  const frontY = toY(depthMm)
  const centerX = toX(widthMm / 2)

  const mountY = faucetMountYMm != null ? toY(-faucetMountYMm) : null
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
      {/* wall — decorative band, drawn above whatever sits furthest back */}
      <g>
        <rect x={left - 10} y={wallY - WALL_BAND_PX} width={right - left + 20} height={WALL_BAND_PX} fill="#e2e8f0" />
        <text x={(left + right) / 2} y={wallY - WALL_BAND_PX / 2 + 4} textAnchor="middle" fontSize={11} className="fill-slate-500" style={{ letterSpacing: 1 }}>
          СТІНА
        </text>
      </g>

      {/* countertop strip between the wall and the basin's rear edge — where the faucet actually mounts */}
      {rearY - wallY > 1 && (
        <>
          <rect x={left} y={wallY} width={right - left} height={rearY - wallY} fill="#d8dee6" stroke="#94a3b8" strokeWidth={1.5} />
          <text x={right - 10} y={wallY + 16} textAnchor="end" fontSize={10} fontWeight={600} className="fill-slate-600">
            стільниця
          </text>
        </>
      )}

      {/*
        Basin rectangle — outer width × the depth actually used for
        containment (bowl depth when the catalog has it, else the outer
        footprint depth; see calculate() in src/calculator/calculator.ts).
      */}
      <rect x={left} y={rearY} width={right - left} height={frontY - rearY} rx={12} fill="#eff6ff" stroke="currentColor" strokeWidth={2.5} className="text-slate-500" />
      <text x={right - 10} y={frontY - 10} textAnchor="end" fontSize={10} className="fill-slate-400" style={{ letterSpacing: 1 }}>
        РАКОВИНА
      </text>
      <line x1={left} y1={rearY} x2={right} y2={rearY} stroke="currentColor" strokeWidth={2.5} className="text-slate-500" />

      {/* target zone */}
      {zoneMinY != null && zoneMaxY != null && (
        <rect x={left} y={zoneMinY} width={right - left} height={zoneMaxY - zoneMinY} fill="#22c55e" opacity={0.18} />
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

      {/* faucet mount point — on the countertop, behind the rear edge */}
      {mountY != null && (
        <g>
          <circle cx={centerX} cy={mountY} r={8} fill="#2563eb" />
          <circle cx={centerX} cy={mountY} r={13} fill="none" stroke="#2563eb" strokeWidth={1.5} opacity={0.4} />
          <text x={centerX + 20} y={mountY + 4} textAnchor="start" fontSize={12} fontWeight={700} fill="#2563eb">
            змішувач
          </text>
        </g>
      )}

      {/* line from faucet to landing point (the jet's footprint on the plan) */}
      {mountY != null && landingY != null && (
        <line x1={centerX} y1={mountY} x2={centerX} y2={landingY} stroke={color} strokeWidth={2.5} strokeDasharray="1 6" strokeLinecap="round" />
      )}

      {/* landing point — may fall short of the rear edge or past the front edge; both are real fail states */}
      {landingY != null && (
        <g>
          <circle cx={centerX} cy={landingY} r={7} fill={color} />
          <text x={centerX} y={landingY - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
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

      {/* depth dimension — basin only, rear to front edge */}
      <g fontSize={11} className="fill-slate-500">
        <line x1={right + 20} y1={rearY} x2={right + 20} y2={frontY} stroke="currentColor" className="text-slate-300" />
        <line x1={right + 16} y1={rearY} x2={right + 24} y2={rearY} stroke="currentColor" className="text-slate-300" />
        <line x1={right + 16} y1={frontY} x2={right + 24} y2={frontY} stroke="currentColor" className="text-slate-300" />
        <text x={right + 30} y={(rearY + frontY) / 2} dominantBaseline="middle">
          {Math.round(depthMm)} мм
        </text>
      </g>

      {/* setback dimension — wall to rear edge, i.e. faucetMountYMm to scale */}
      {mountY != null && faucetMountYMm != null && faucetMountYMm > 0 && (
        <g fontSize={11} className="fill-slate-500">
          <line x1={right + 20} y1={wallY} x2={right + 20} y2={rearY} stroke="currentColor" className="text-slate-300" />
          <line x1={right + 16} y1={wallY} x2={right + 24} y2={wallY} stroke="currentColor" className="text-slate-300" />
          <line x1={right + 16} y1={rearY} x2={right + 24} y2={rearY} stroke="currentColor" className="text-slate-300" />
          <text x={right + 30} y={(wallY + rearY) / 2} dominantBaseline="middle">
            {faucetMountYMm} мм
          </text>
        </g>
      )}

      <text x={left} y={rearY + 14} textAnchor="start" fontSize={10} className="fill-slate-400">
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
