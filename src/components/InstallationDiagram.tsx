import { useMemo } from 'react'

export interface InstallationDiagramProps {
  /** Effective bowl depth used for containment (bowlDepth ?? outer depth), mm. */
  bowlDepthMm: number | null
  /** Bowl indentation depth below the rim, mm. Falls back to a schematic default when unknown. */
  bowlHeightMm: number | null
  faucetMountYMm: number | null
  spoutHeightMm: number | null
  spoutProjectionMm: number | null
  landingYMm: number | null
  targetZone: { minimumYMm: number | null; maximumYMm: number | null }
  geometryVerdict: 'ok' | 'warning' | 'fail' | 'unknown'
}

const SCHEMATIC_BOWL_DEPTH_MM = 120 // visual-only fallback when bowlHeight is unknown; never used in calculations

const VIEW_W = 700
const VIEW_H = 380
const MARGIN_X = 60
const MARGIN_TOP = 40
const MARGIN_BOTTOM = 70

const verdictColor: Record<InstallationDiagramProps['geometryVerdict'], string> = {
  ok: 'var(--diagram-ok, #16a34a)',
  warning: 'var(--diagram-warning, #d97706)',
  fail: 'var(--diagram-fail, #dc2626)',
  unknown: 'var(--diagram-unknown, #64748b)',
}

export default function InstallationDiagram({
  bowlDepthMm,
  bowlHeightMm,
  faucetMountYMm,
  spoutHeightMm,
  spoutProjectionMm,
  landingYMm,
  targetZone,
  geometryVerdict,
}: InstallationDiagramProps) {
  const layout = useMemo(() => {
    const depthMm = Math.max(bowlDepthMm ?? 400, landingYMm ?? 0, 200)
    const bowlPxDepthMm = bowlHeightMm ?? SCHEMATIC_BOWL_DEPTH_MM
    const spoutHeadroomMm = Math.max(spoutHeightMm ?? 150, 80) + 40

    const plotW = VIEW_W - MARGIN_X * 2
    const plotH = VIEW_H - MARGIN_TOP - MARGIN_BOTTOM

    const scaleX = plotW / depthMm
    const scaleY = (plotH - bowlPxDepthMm) / spoutHeadroomMm
    const scale = Math.min(scaleX, scaleY, 1.4)

    const rimY = MARGIN_TOP + spoutHeadroomMm * scale
    const toX = (yMm: number) => MARGIN_X + yMm * scale
    const toDy = (mm: number) => mm * scale

    return { depthMm, bowlPxDepthMm, rimY, toX, toDy, scale }
  }, [bowlDepthMm, bowlHeightMm, spoutHeightMm, landingYMm])

  const { depthMm, bowlPxDepthMm, rimY, toX, toDy } = layout

  const rearX = toX(0)
  const frontX = toX(depthMm)
  const bowlBottomY = rimY + toDy(bowlPxDepthMm)

  const mountX = faucetMountYMm != null ? toX(faucetMountYMm) : null
  const spoutTopY = spoutHeightMm != null && mountX != null ? rimY - toDy(spoutHeightMm) : null
  const landingX = landingYMm != null ? toX(landingYMm) : null
  const landingY = rimY + toDy(bowlPxDepthMm) * 0.45

  const zoneMinX = targetZone.minimumYMm != null ? toX(targetZone.minimumYMm) : null
  const zoneMaxX = targetZone.maximumYMm != null ? toX(targetZone.maximumYMm) : null

  const color = verdictColor[geometryVerdict]

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Схема перерізу встановлення раковини та змішувача"
      className="w-full h-auto"
    >
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="none" />

      {/* target zone */}
      {zoneMinX != null && zoneMaxX != null && (
        <rect
          x={zoneMinX}
          y={rimY}
          width={zoneMaxX - zoneMinX}
          height={bowlBottomY - rimY}
          fill="#22c55e"
          opacity={0.15}
        />
      )}

      {/* basin box */}
      <rect
        x={rearX}
        y={rimY}
        width={frontX - rearX}
        height={bowlBottomY - rimY}
        rx={10}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        className="text-slate-400"
      />
      <line x1={rearX} y1={rimY} x2={frontX} y2={rimY} stroke="currentColor" strokeWidth={2.5} className="text-slate-500" />
      <text x={(rearX + frontX) / 2} y={(rimY + bowlBottomY) / 2 + 5} textAnchor="middle" fontSize={13} className="fill-slate-400" style={{ letterSpacing: 1 }}>
        РАКОВИНА
      </text>

      {/* drain marker (X position unknown for every catalog model — shown centered, dashed) */}
      <g opacity={0.6}>
        <line x1={(rearX + frontX) / 2} y1={bowlBottomY} x2={(rearX + frontX) / 2} y2={bowlBottomY + 22} stroke="currentColor" strokeDasharray="3 3" className="text-slate-400" />
        <text x={(rearX + frontX) / 2} y={bowlBottomY + 36} textAnchor="middle" fontSize={11} className="fill-slate-400">
          ЗЛИВ (позиція невідома)
        </text>
      </g>

      {/* faucet riser + spout curve + landing point */}
      {mountX != null && spoutTopY != null && (
        <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round">
          <line x1={mountX} y1={rimY} x2={mountX} y2={spoutTopY} />
          {landingX != null ? (
            <path d={`M ${mountX} ${spoutTopY} Q ${landingX} ${spoutTopY} ${landingX} ${landingY}`} />
          ) : null}
          <circle cx={mountX} cy={rimY} r={4} fill={color} stroke="none" />
        </g>
      )}
      {landingX != null && (
        <g>
          <circle cx={landingX} cy={landingY} r={6} fill={color} />
          <text x={landingX} y={landingY - 14} textAnchor="middle" fontSize={12} fontWeight={600} fill={color}>
            точка падіння
          </text>
        </g>
      )}
      {mountX != null && landingX != null && spoutProjectionMm != null && (
        <text x={(mountX + landingX) / 2} y={spoutTopY != null ? spoutTopY - 8 : rimY - 8} textAnchor="middle" fontSize={11} className="fill-slate-500">
          виліт {spoutProjectionMm} мм
        </text>
      )}
      {mountX == null && (
        <text x={VIEW_W / 2} y={MARGIN_TOP + 10} textAnchor="middle" fontSize={13} className="fill-amber-600">
          Введіть позицію кріплення змішувача, щоб побачити струмінь
        </text>
      )}

      {/* dimension line: depth from rear edge */}
      <g fontSize={11} className="fill-slate-500">
        <line x1={rearX} y1={bowlBottomY + 48} x2={frontX} y2={bowlBottomY + 48} stroke="currentColor" className="text-slate-300" />
        <line x1={rearX} y1={bowlBottomY + 44} x2={rearX} y2={bowlBottomY + 52} stroke="currentColor" className="text-slate-300" />
        <line x1={frontX} y1={bowlBottomY + 44} x2={frontX} y2={bowlBottomY + 52} stroke="currentColor" className="text-slate-300" />
        <text x={(rearX + frontX) / 2} y={bowlBottomY + 62} textAnchor="middle">
          глибина {Math.round(depthMm)} мм
        </text>
        <text x={rearX} y={rimY - 6} textAnchor="start">
          задній край
        </text>
        <text x={frontX} y={rimY - 6} textAnchor="end">
          передній край
        </text>
      </g>

      {spoutHeightMm != null && mountX != null && spoutTopY != null && (
        <g fontSize={11} className="fill-slate-500">
          <line x1={mountX - 14} y1={rimY} x2={mountX - 14} y2={spoutTopY} stroke="currentColor" className="text-slate-300" />
          <text x={mountX - 20} y={(rimY + spoutTopY) / 2} textAnchor="end" dominantBaseline="middle">
            {spoutHeightMm} мм
          </text>
        </g>
      )}
    </svg>
  )
}
