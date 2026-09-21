import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { faucetBrands, searchFaucets } from '../catalog/catalog'

const selectClass =
  'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400'

export default function FaucetsCatalogPage() {
  const [brand, setBrand] = useState('')
  const [query, setQuery] = useState('')

  const results = useMemo(() => searchFaucets({ brand: brand || undefined, query: query || undefined }), [brand, query])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Каталог змішувачів</h1>
        <p className="text-slate-500 mt-1">
          Реальні моделі GROHE та hansgrohe — див.{' '}
          <a href="https://github.com/shakhanton/SanMeyster/blob/main/research/faucets-raw.md" className="underline" target="_blank" rel="noreferrer">
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
          {faucetBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-400">{results.length} моделей</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((f) => (
          <Link
            key={f.id}
            to={`/faucets/${encodeURIComponent(f.brand)}/${f.id}`}
            className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 transition-colors"
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">{f.brand}</div>
            <div className="font-medium text-slate-900 mt-0.5">{f.model}</div>
            <div className="text-sm text-slate-500 mt-1">
              {f.spoutProjection ? `Виліт ${f.spoutProjection.value} мм` : 'Виліт невідомий'}
              {f.spoutHeight ? ` · Висота ${f.spoutHeight.value} мм` : ''}
            </div>
          </Link>
        ))}
        {results.length === 0 && <p className="text-slate-400 col-span-full text-center py-8">Нічого не знайдено.</p>}
      </div>
    </div>
  )
}
