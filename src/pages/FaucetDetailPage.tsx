import { Link, useParams } from 'react-router-dom'
import { getFaucet } from '../data'
import type { Sourced } from '../data/types'

function SpecRow({ label, sourced }: { label: string; sourced: Sourced<number | string> | null }) {
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

export default function FaucetDetailPage() {
  const { model } = useParams()
  const faucet = model ? getFaucet(model) : undefined

  if (!faucet) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Модель не знайдена в каталозі.
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="text-sm uppercase tracking-wide text-slate-400">{faucet.brand}</div>
        <h1 className="text-2xl font-semibold text-slate-900">{faucet.model}</h1>
        <p className="text-slate-500 mt-1">
          {faucet.installationType === 'deck-mounted' ? 'На стільницю' : 'Настінний'}
          {faucet.articleNumber && <> · Артикул {faucet.articleNumber}</>}
        </p>
        {faucet.productUrl && (
          <a href={faucet.productUrl} target="_blank" rel="noreferrer" className="text-sm underline text-slate-500 hover:text-slate-700">
            Сторінка виробника ↗
          </a>
        )}
      </div>

      <table className="w-full text-sm">
        <tbody>
          <SpecRow label="Загальна висота" sourced={faucet.totalHeight} />
          <SpecRow label="Висота виливу над бортом" sourced={faucet.spoutHeight} />
          <SpecRow label="Виліт носика" sourced={faucet.spoutProjection} />
          <SpecRow label="Тип аератора" sourced={faucet.aeratorType} />
          <SpecRow label="Кут повороту" sourced={faucet.swivelRange} />
        </tbody>
      </table>

      <p className="text-xs text-slate-400">
        Перевірено: {faucet.verifiedAt}. Поля `null` означають, що достовірного джерела не знайдено — див.{' '}
        <a href="https://github.com/shakhanton/SanMeyster/blob/main/research/faucets-raw.md" className="underline" target="_blank" rel="noreferrer">
          research/faucets-raw.md
        </a>
        .
      </p>

      <Link
        to={`/?faucet=${encodeURIComponent(faucet.id)}`}
        className="inline-block bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-700"
      >
        Розрахувати встановлення з цим змішувачем →
      </Link>
    </div>
  )
}
