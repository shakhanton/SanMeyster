import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { basinBrands, installationTypes, searchBasins } from '../catalog/catalog'
import { installationTypeLabels } from '../utils/labels'
import type { InstallationType } from '../data/types'

const selectClass =
  'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400'

export default function BasinsCatalogPage() {
  const [brand, setBrand] = useState('')
  const [installationType, setInstallationType] = useState<InstallationType | ''>('')
  const [query, setQuery] = useState('')

  const results = useMemo(
    () => searchBasins({ brand: brand || undefined, installationType: installationType || undefined, query: query || undefined }),
    [brand, installationType, query],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Каталог раковин</h1>
        <p className="text-slate-500 mt-1">
          Реальні моделі Geberit та Villeroy & Boch з підтвердженими джерелами — див.{' '}
          <a href="https://github.com/shakhanton/SanMeyster/blob/main/research/basins-raw.md" className="underline" target="_blank" rel="noreferrer">
            дослідницькі нотатки
          </a>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className={selectClass + ' flex-1 min-w-48'}
          placeholder="Пошук за назвою або артикулом"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={selectClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Усі бренди</option>
          {basinBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select className={selectClass} value={installationType} onChange={(e) => setInstallationType(e.target.value as InstallationType | '')}>
          <option value="">Усі типи встановлення</option>
          {installationTypes.map((t) => (
            <option key={t} value={t}>
              {installationTypeLabels[t]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-400">{results.length} моделей</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((b) => (
          <Link
            key={b.id}
            to={`/basins/${encodeURIComponent(b.brand)}/${b.id}`}
            className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 transition-colors"
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">{b.brand}</div>
            <div className="font-medium text-slate-900 mt-0.5">{b.model}</div>
            <div className="text-sm text-slate-500 mt-1">
              {b.width && b.depth ? `${b.width.value} × ${b.depth.value} мм` : 'Розміри частково невідомі'}
            </div>
            <div className="text-xs text-slate-400 mt-2">{installationTypeLabels[b.installationType]}</div>
          </Link>
        ))}
        {results.length === 0 && <p className="text-slate-400 col-span-full text-center py-8">Нічого не знайдено.</p>}
      </div>
    </div>
  )
}
