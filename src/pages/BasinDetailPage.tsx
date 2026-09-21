import { Link, useParams } from 'react-router-dom'
import { getBasin } from '../data'
import { installationTypeLabels } from '../utils/labels'
import type { Sourced } from '../data/types'

function SpecRow({ label, sourced }: { label: string; sourced: Sourced<number | boolean | string> | null }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-2 pr-4 text-slate-500">{label}</td>
      <td className="py-2 pr-4 font-medium text-slate-900">
        {sourced == null ? <span className="text-slate-300">null</span> : String(sourced.value) + (sourced.unit ? ` ${sourced.unit}` : '')}
      </td>
      <td className="py-2 text-xs text-slate-400">
        {sourced?.sourceUrl ? (
          <a href={sourced.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-slate-600">
            {sourced.source} ({sourced.confidence})
          </a>
        ) : (
          sourced?.source ?? '—'
        )}
      </td>
    </tr>
  )
}

export default function BasinDetailPage() {
  const { model } = useParams()
  const basin = model ? getBasin(model) : undefined

  if (!basin) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Модель не знайдена в каталозі.
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="text-sm uppercase tracking-wide text-slate-400">{basin.brand}</div>
        <h1 className="text-2xl font-semibold text-slate-900">{basin.model}</h1>
        <p className="text-slate-500 mt-1">
          {installationTypeLabels[basin.installationType]}
          {basin.articleNumber && <> · Артикул {basin.articleNumber}</>}
        </p>
        {basin.productUrl && (
          <a href={basin.productUrl} target="_blank" rel="noreferrer" className="text-sm underline text-slate-500 hover:text-slate-700">
            Сторінка виробника ↗
          </a>
        )}
      </div>

      <table className="w-full text-sm">
        <tbody>
          <SpecRow label="Ширина" sourced={basin.width} />
          <SpecRow label="Глибина" sourced={basin.depth} />
          <SpecRow label="Висота" sourced={basin.height} />
          <SpecRow label="Ширина чаші" sourced={basin.bowlWidth} />
          <SpecRow label="Глибина чаші" sourced={basin.bowlDepth} />
          <SpecRow label="Висота/глибина чаші" sourced={basin.bowlHeight} />
          <SpecRow label="Отвір під змішувач" sourced={basin.faucetHole} />
          <SpecRow label="Кількість отворів" sourced={basin.faucetHoleCount} />
          <SpecRow label="Позиція отвору від заднього краю" sourced={basin.faucetHolePosition} />
          <SpecRow label="Перелив (overflow)" sourced={basin.overflow} />
          <SpecRow label="Координати X зливу" sourced={basin.drainPositionX} />
          <SpecRow label="Координати Y зливу" sourced={basin.drainPositionY} />
        </tbody>
      </table>

      <p className="text-xs text-slate-400">
        Перевірено: {basin.verifiedAt}. Поля `null` означають, що достовірного джерела не знайдено — див.{' '}
        <a href="https://github.com/shakhanton/SanMeyster/blob/main/research/basins-raw.md" className="underline" target="_blank" rel="noreferrer">
          research/basins-raw.md
        </a>
        .
      </p>

      <Link
        to={`/?basin=${encodeURIComponent(basin.id)}`}
        className="inline-block bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700"
      >
        Розрахувати встановлення з цією раковиною →
      </Link>
    </div>
  )
}
