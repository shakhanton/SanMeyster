import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { basins, faucets, getBasin, getFaucet } from '../data'
import type { Jurisdiction } from '../data/types'
import { basinBrands, faucetBrands, searchBasins, searchFaucets } from '../catalog/catalog'
import { calculate } from '../calculator/calculator'
import InstallationDiagram from '../components/InstallationDiagram'
import VerdictBadge from '../components/VerdictBadge'
import ExplanationPanel from '../components/ExplanationPanel'
import { installationTypeLabels, jurisdictionLabels } from '../utils/labels'

const selectClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400'
const labelClass = 'block text-sm font-medium text-slate-700 mb-1'

export default function CalculatorPage() {
  const [searchParams] = useSearchParams()

  const [basinBrand, setBasinBrand] = useState('')
  const [basinId, setBasinId] = useState(searchParams.get('basin') ?? '')
  const [faucetBrand, setFaucetBrand] = useState('')
  const [faucetId, setFaucetId] = useState(searchParams.get('faucet') ?? '')

  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('UA')
  const [accessible, setAccessible] = useState(false)
  const [faucetMountY, setFaucetMountY] = useState(20)
  const [basinHeight, setBasinHeight] = useState(800)

  const basin = basinId ? getBasin(basinId) : undefined
  const faucet = faucetId ? getFaucet(faucetId) : undefined

  // Preselect brand dropdown when a model is preselected via URL (from a detail page).
  useEffect(() => {
    if (basin) setBasinBrand(basin.brand)
  }, [basin])
  useEffect(() => {
    if (faucet) setFaucetBrand(faucet.brand)
  }, [faucet])

  const effectiveBowlDepth = basin ? (basin.bowlDepth?.value ?? basin.depth?.value ?? 400) : 400

  // Reset dependent inputs to a sane default whenever the basin changes.
  // Note: mounting height above the floor is an installation decision, independent
  // of the basin's own physical height dimension (basin.height) — never derived from it.
  useEffect(() => {
    if (!basin) return
    setFaucetMountY((prev) => Math.min(prev, effectiveBowlDepth))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basinId])

  const basinOptions = useMemo(() => searchBasins({ brand: basinBrand || undefined }), [basinBrand])
  const faucetOptions = useMemo(() => searchFaucets({ brand: faucetBrand || undefined }), [faucetBrand])

  const result = useMemo(() => {
    if (!basin || !faucet) return null
    return calculate({
      basin,
      faucet,
      jurisdiction,
      accessible,
      faucetMountYMm: faucetMountY,
      installedBasinHeightMm: basinHeight,
    })
  }, [basin, faucet, jurisdiction, accessible, faucetMountY, basinHeight])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Розрахувати встановлення</h1>
        <p className="text-slate-500 mt-1">
          Оберіть раковину та змішувач з каталогу реальних моделей, вкажіть параметри монтажу — схема та
          сумісність перераховуються одразу.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="font-semibold text-slate-900 mb-3">1. Раковина</h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Бренд</label>
              <select
                className={selectClass}
                value={basinBrand}
                onChange={(e) => {
                  setBasinBrand(e.target.value)
                  setBasinId('')
                }}
              >
                <option value="">Усі бренди ({basins.length})</option>
                {basinBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Модель</label>
              <select className={selectClass} value={basinId} onChange={(e) => setBasinId(e.target.value)}>
                <option value="">— оберіть модель —</option>
                {basinOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.model} {b.width ? `(${b.width.value}×${b.depth?.value ?? '?'} мм)` : ''}
                  </option>
                ))}
              </select>
            </div>
            {basin && (
              <p className="text-xs text-slate-400">
                Тип встановлення: <strong>{installationTypeLabels[basin.installationType]}</strong>
                {basin.articleNumber && <> · Артикул: {basin.articleNumber}</>}
              </p>
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-4">
          <h2 className="font-semibold text-slate-900 mb-3">2. Змішувач</h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Бренд</label>
              <select
                className={selectClass}
                value={faucetBrand}
                onChange={(e) => {
                  setFaucetBrand(e.target.value)
                  setFaucetId('')
                }}
              >
                <option value="">Усі бренди ({faucets.length})</option>
                {faucetBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Модель</label>
              <select className={selectClass} value={faucetId} onChange={(e) => setFaucetId(e.target.value)}>
                <option value="">— оберіть модель —</option>
                {faucetOptions.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.model}
                  </option>
                ))}
              </select>
            </div>
            {faucet && (
              <p className="text-xs text-slate-400">
                Виліт: {faucet.spoutProjection ? `${faucet.spoutProjection.value} мм` : 'невідомо'} · Висота
                виливу: {faucet.spoutHeight ? `${faucet.spoutHeight.value} мм` : 'невідомо'}
                {faucet.articleNumber && <> · Артикул: {faucet.articleNumber}</>}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="bg-white border border-slate-200 rounded-lg p-4">
        <h2 className="font-semibold text-slate-900 mb-3">3. Параметри монтажу</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              Відстань від заднього краю раковини до кріплення змішувача: {faucetMountY} мм
            </label>
            <input
              type="range"
              min={0}
              max={Math.round(effectiveBowlDepth)}
              value={faucetMountY}
              onChange={(e) => setFaucetMountY(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-400 mt-1">
              Жоден виробник у дослідженні не публікує цю відстань — вкажіть її за фактичним кресленням.
            </p>
          </div>
          <div>
            <label className={labelClass}>Висота встановлення раковини (від підлоги): {basinHeight} мм</label>
            <input
              type="range"
              min={600}
              max={1000}
              value={basinHeight}
              onChange={(e) => setBasinHeight(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className={labelClass}>Нормативний профіль</label>
            <select className={selectClass} value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}>
              <option value="UA">{jurisdictionLabels.UA}</option>
              <option value="DE">{jurisdictionLabels.DE}</option>
              <option value="professional">{jurisdictionLabels.professional}</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={accessible} onChange={(e) => setAccessible(e.target.checked)} />
              Профіль доступності (МГН / inclusive design)
            </label>
          </div>
        </div>
      </section>

      {!basin || !faucet ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          Оберіть раковину та змішувач, щоб побачити результат.
        </div>
      ) : (
        result && <CalculatorResult basin={basin} faucet={faucet} result={result} faucetMountY={faucetMountY} />
      )}
    </div>
  )
}

function CalculatorResult({
  basin,
  faucet,
  result,
  faucetMountY,
}: {
  basin: NonNullable<ReturnType<typeof getBasin>>
  faucet: NonNullable<ReturnType<typeof getFaucet>>
  result: NonNullable<ReturnType<typeof calculate>>
  faucetMountY: number
}) {
  const bowlDepthMm = basin.bowlDepth?.value ?? basin.depth?.value ?? null

  return (
    <section className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <InstallationDiagram
          bowlDepthMm={bowlDepthMm}
          bowlHeightMm={basin.bowlHeight?.value ?? null}
          faucetMountYMm={faucetMountY}
          spoutHeightMm={faucet.spoutHeight?.value ?? null}
          spoutProjectionMm={faucet.spoutProjection?.value ?? null}
          landingYMm={result.landingYMm}
          targetZone={result.targetZone}
          geometryVerdict={result.geometry.verdict}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <ResultCard title="Геометрія" verdict={result.geometry.verdict} message={result.geometry.message} />
        <ResultCard title="Ергономіка" verdict={result.ergonomics.verdict} message={result.ergonomics.message} />
        <ResultCard
          title="Нормативи"
          verdict={result.standards.verdict}
          message={
            result.standards.checks.length === 0
              ? 'Немає правил для цього профілю.'
              : result.standards.checks
                  .map((c) => `${c.rule.parameter}: ${c.pass == null ? 'н/д' : c.pass ? 'ОК' : 'не відповідає'}`)
                  .join('; ')
          }
        />
        <ResultCard title="Виробник" verdict={result.manufacturer.verdict} message={result.manufacturer.message} />
        <ResultCard
          title="Дані"
          verdict={result.dataQuality.verdict === 'ok' ? 'ok' : 'warning'}
          message={result.dataQuality.caveats.join(' ') || 'Усі ключові параметри підтверджені джерелами.'}
        />
      </div>

      <ExplanationPanel entries={result.explanation} />

      <p className="text-xs text-slate-400 border-t border-slate-200 pt-4">
        Результат є інженерним розрахунком та рекомендацією. Остаточне рішення щодо монтажу необхідно приймати з
        урахуванням фактичних розмірів виробів, технічної документації виробника та чинних нормативних вимог.
      </p>
    </section>
  )
}

function ResultCard({ title, verdict, message }: { title: string; verdict: 'ok' | 'warning' | 'fail' | 'unknown'; message: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3">
      <h3 className="text-sm font-semibold text-slate-500 mb-1">{title}</h3>
      <VerdictBadge verdict={verdict}>
        {verdict === 'ok' && 'Підходить'}
        {verdict === 'warning' && 'Увага'}
        {verdict === 'fail' && 'Не відповідає'}
        {verdict === 'unknown' && 'Немає даних'}
      </VerdictBadge>
      <p className="text-xs text-slate-500 mt-1.5 leading-snug">{message}</p>
    </div>
  )
}
