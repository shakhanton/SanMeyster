import { useMemo } from 'react'
import { type DiagramData, SCHEMATIC_BOWL_HEIGHT_MM, verdictColor } from './diagram-types'

const VIEW_W = 700
const VIEW_H = 460
const LEFT_MARGIN = 70 // room for the counter slab's overhang behind the faucet
const RIGHT_MARGIN = 90 // room for the rim-height dimension line + label
const TOP_MARGIN = 60 // room for the clearance verdict callout
const BOTTOM_MARGIN = 70 // room for the depth dimension line + label
const BEHIND_MARGIN_MM = 20
const SLAB_THICKNESS_PX = 18 // decorative — countertop material thickness isn't in any source

/**
 * Side elevation (cross-section) — the view that actually answers "is the
 * faucet physically tall enough for this basin?" The plan and isometric
 * views show horizontal placement; neither shows whether the spout clears
 * the basin's own rim height before the water can get into the bowl. A
 * low-profile faucet on a tall vessel/countertop basin can have perfect
 * horizontal geometry and still be unusable — see evaluateRimClearance in
 * src/geometry/geometry.ts.
 *
 * ONE shared mm-to-px scale drives both axes (horizontal depth, vertical
 * height) so real proportions hold — no separate axis exaggeration.
 */
export default function InstallationDiagramSide({
  bowlDepthMm,
  bowlHeightMm,
  faucetMountYMm,
  spoutHeightMm,
  spoutProjectionMm,
  landingYMm,
  rimHeightMm,
  clearanceVerdict,
  geometryVerdict,
}: DiagramData) {
  const layout = useMemo(() => {
    const depthMm = Math.max(bowlDepthMm ?? 400, 200)
    const mountValMm = faucetMountYMm ?? 0
    const landingValMm = landingYMm ?? 0
    const rimZ = rimHeightMm ?? 0
    const spoutZ = spoutHeightMm ?? 0
    const bowlBottomZ = rimZ - (bowlHeightMm ?? SCHEMATIC_BOWL_HEIGHT_MM)

    const minYMm = Math.min(-mountValMm, landingValMm, 0) - BEHIND_MARGIN_MM
    const maxYMm = Math.max(depthMm, landingValMm)
    const minZMm = Math.min(bowlBottomZ, 0) - 20
    const maxZMm = Math.max(rimZ, spoutZ, 0) + 40

    const plotW = VIEW_W - LEFT_MARGIN - RIGHT_MARGIN
    const plotH = VIEW_H - TOP_MARGIN - BOTTOM_MARGIN

    // One shared scale for both axes — real proportions, no exaggeration.
    const scale = Math.min(plotW / (maxYMm - minYMm), plotH / (maxZMm - minZMm))

    const originX = LEFT_MARGIN + (plotW - (maxYMm - minYMm) * scale) / 2
    const originY = TOP_MARGIN + (plotH - (maxZMm - minZMm) * scale) / 2

    const toX = (yMm: number) => originX + (yMm - minYMm) * scale
    // Z increases upward in the real world, downward in SVG screen space.
    const toY = (zMm: number) => originY + (maxZMm - zMm) * scale

    // When the basin rests ON the counter (rim above it), its drawn body
    // extends down to at least counter level (Z=0) so it visually sits on
    // the slab, even if the modeled bowl interior bottom is shallower.
    const visualBottomZ = rimZ > 0 ? Math.min(bowlBottomZ, 0) : bowlBottomZ

    return { depthMm, rimZ, visualBottomZ, toX, toY }
  }, [bowlDepthMm, bowlHeightMm, faucetMountYMm, landingYMm, rimHeightMm, spoutHeightMm])

  const { depthMm, rimZ, visualBottomZ, toX, toY } = layout

  const counterY = toY(0)
  const rearX = toX(0)
  const frontX = toX(depthMm)
  const rimY = toY(rimZ)
  const bottomY = toY(visualBottomZ)
  const mountX = faucetMountYMm != null ? toX(-faucetMountYMm) : null
  const spoutTopY = spoutHeightMm != null ? toY(spoutHeightMm) : null
  const landingX = landingYMm != null ? toX(landingYMm) : null

  const clearanceColor = verdictColor[clearanceVerdict]
  const jetColor = verdictColor[geometryVerdict]
  const rimKnown = rimHeightMm != null
  // rimZ <= 0 means the rim sits at/below the counter (inset/undermount —
  // the bowl hangs through a cutout); rimZ > 0 means it sits above the
  // counter (countertop/furniture — the basin rests on top of it). This is
  // now driven directly by the one user-editable rim-height value, not by
  // installation-type branching (see calculate() in src/calculator).
  const restsOnCounter = rimZ > 0
  const slabLeft = Math.min(rearX, mountX ?? rearX) - 40

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Переріз збоку: висота раковини та висота виливу змішувача"
      className="w-full h-auto"
    >
      {/* countertop — a filled slab, not just a line, so "table" and
          "basin" read as two distinct objects. Continuous under the basin
          when it rests on top; stops at both edges (cutout) when the rim
          is flush with or below the counter. */}
      {restsOnCounter ? (
        <rect x={slabLeft} y={counterY} width={frontX + 30 - slabLeft} height={SLAB_THICKNESS_PX} fill="#d8dee6" stroke="#94a3b8" strokeWidth={1} />
      ) : (
        <>
          <rect x={slabLeft} y={counterY} width={rearX - slabLeft} height={SLAB_THICKNESS_PX} fill="#d8dee6" stroke="#94a3b8" strokeWidth={1} />
          <rect x={frontX} y={counterY} width={30} height={SLAB_THICKNESS_PX} fill="#d8dee6" stroke="#94a3b8" strokeWidth={1} />
        </>
      )}
      <text x={frontX - 6} y={counterY + SLAB_THICKNESS_PX / 2 + 4} textAnchor="end" fontSize={10} fontWeight={600} className="fill-slate-600">
        стільниця
      </text>

      {/* basin cross-section — distinct fill from the counter slab above */}
      <path
        d={`M ${rearX} ${rimY} L ${frontX} ${rimY} L ${frontX} ${bottomY} L ${rearX} ${bottomY} Z`}
        fill="#eff6ff"
        stroke="currentColor"
        strokeWidth={2.5}
        className="text-slate-500"
      />
      <line x1={rearX} y1={rimY} x2={frontX} y2={rimY} stroke="currentColor" strokeWidth={2.5} className="text-slate-600" />
      <text x={(rearX + frontX) / 2} y={(rimY + bottomY) / 2} textAnchor="middle" fontSize={11} className="fill-slate-400" style={{ letterSpacing: 1 }}>
        РАКОВИНА
      </text>
      {!rimKnown && (
        <text x={(rearX + frontX) / 2} y={rimY - 8} textAnchor="middle" fontSize={10} className="fill-amber-600">
          висота борту невідома — показано орієнтовно
        </text>
      )}

      {/* rim height reference line — the key comparison for clearance */}
      {rimKnown && (
        <line x1={rearX - 30} y1={rimY} x2={frontX + 10} y2={rimY} stroke={clearanceColor} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.7} />
      )}

      {/* faucet riser + spout + drop */}
      {mountX != null && spoutTopY != null && (
        <g stroke={jetColor} strokeWidth={3} fill="none" strokeLinecap="round">
          <line x1={mountX} y1={counterY} x2={mountX} y2={spoutTopY} />
          {landingX != null && <path d={`M ${mountX} ${spoutTopY} L ${landingX} ${spoutTopY}`} />}
          {landingX != null && <line x1={landingX} y1={spoutTopY} x2={landingX} y2={bottomY} strokeDasharray="2 4" />}
          <circle cx={mountX} cy={counterY} r={5} fill="#2563eb" stroke="none" />
        </g>
      )}
      {mountX != null && (
        <text x={mountX} y={counterY + 30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
          змішувач
        </text>
      )}
      {landingX != null && (
        <circle cx={landingX} cy={bottomY} r={6} fill={jetColor} />
      )}

      {mountX == null && (
        <text x={VIEW_W / 2} y={20} textAnchor="middle" fontSize={13} className="fill-amber-600">
          Вкажіть позицію кріплення змішувача нижче
        </text>
      )}

      {/* rim height dimension (left side) */}
      {rimKnown && (
        <g fontSize={11} className="fill-slate-500">
          <line x1={frontX + 20} y1={counterY} x2={frontX + 20} y2={rimY} stroke="currentColor" className="text-slate-300" />
          <line x1={frontX + 16} y1={counterY} x2={frontX + 24} y2={counterY} stroke="currentColor" className="text-slate-300" />
          <line x1={frontX + 16} y1={rimY} x2={frontX + 24} y2={rimY} stroke="currentColor" className="text-slate-300" />
          <text x={frontX + 30} y={(counterY + rimY) / 2} textAnchor="start" dominantBaseline="middle">
            {rimZ} мм
          </text>
        </g>
      )}

      {/* spout height dimension */}
      {mountX != null && spoutTopY != null && (
        <g fontSize={11} className="fill-slate-500">
          <line x1={mountX - 16} y1={counterY} x2={mountX - 16} y2={spoutTopY} stroke="currentColor" className="text-slate-300" />
          <text x={mountX - 22} y={(counterY + spoutTopY) / 2} textAnchor="end" dominantBaseline="middle">
            {spoutHeightMm} мм
          </text>
        </g>
      )}

      {/* clearance verdict callout */}
      {rimKnown && spoutHeightMm != null && (
        <text x={(rearX + frontX) / 2} y={TOP_MARGIN - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={clearanceColor}>
          {clearanceVerdict === 'ok'
            ? `Виліт (${spoutHeightMm} мм) перекриває борт (${rimZ} мм)`
            : `Виліт (${spoutHeightMm} мм) НЕ перекриває борт (${rimZ} мм)`}
        </text>
      )}

      {/* depth dimension */}
      <g fontSize={11} className="fill-slate-500">
        <line x1={rearX} y1={Math.max(counterY, bottomY) + 40} x2={frontX} y2={Math.max(counterY, bottomY) + 40} stroke="currentColor" className="text-slate-300" />
        <line x1={rearX} y1={Math.max(counterY, bottomY) + 36} x2={rearX} y2={Math.max(counterY, bottomY) + 44} stroke="currentColor" className="text-slate-300" />
        <line x1={frontX} y1={Math.max(counterY, bottomY) + 36} x2={frontX} y2={Math.max(counterY, bottomY) + 44} stroke="currentColor" className="text-slate-300" />
        <text x={(rearX + frontX) / 2} y={Math.max(counterY, bottomY) + 56} textAnchor="middle">
          глибина {Math.round(depthMm)} мм
        </text>
      </g>

      <text x={rearX} y={Math.min(rimY, counterY) - 8} fontSize={10} className="fill-slate-400">
        задній край
      </text>
      <text x={frontX} y={Math.min(rimY, counterY) - 8} textAnchor="end" fontSize={10} className="fill-slate-400">
        передній край
      </text>

      {spoutProjectionMm != null && mountX != null && landingX != null && spoutTopY != null && (
        <text x={(mountX + landingX) / 2} y={spoutTopY - 8} textAnchor="middle" fontSize={10} className="fill-slate-400">
          виліт {spoutProjectionMm} мм
        </text>
      )}
    </svg>
  )
}
