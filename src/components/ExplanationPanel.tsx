import { useState } from 'react'
import type { ExplanationEntry } from '../calculator/calculator'

export default function ExplanationPanel({ entries }: { entries: ExplanationEntry[] }) {
  const [open, setOpen] = useState(false)

  if (entries.length === 0) return null

  return (
    <div className="border border-slate-200 rounded-lg bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-slate-700"
      >
        <span>Чому калькулятор рекомендує саме це?</span>
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="divide-y divide-slate-100 border-t border-slate-100">
          {entries.map((entry, i) => (
            <li key={i} className="px-4 py-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-600">{entry.label}</span>
                <span className="font-medium text-slate-900">{entry.value}</span>
              </div>
              {entry.source && (
                <div className="mt-1 text-xs text-slate-400">
                  {entry.sourceUrl ? (
                    <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-slate-600 underline">
                      {entry.source}
                    </a>
                  ) : (
                    entry.source
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
