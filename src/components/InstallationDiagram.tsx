import { useState } from 'react'
import type { DiagramData } from './diagram-types'
import InstallationDiagramPlan from './InstallationDiagramPlan'
import InstallationDiagramSide from './InstallationDiagramSide'
import InstallationDiagramIso from './InstallationDiagramIso'

export type { DiagramData } from './diagram-types'

type Mode = 'top' | 'side' | '3d'

const MODES: Array<{ id: Mode; label: string }> = [
  { id: 'top', label: '2D (зверху)' },
  { id: 'side', label: '2D (збоку)' },
  { id: '3d', label: '3D' },
]

export default function InstallationDiagram(props: DiagramData) {
  const [mode, setMode] = useState<Mode>('top')

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> змішувач
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-slate-400 inline-block" /> злив
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" /> точка падіння води
          </span>
        </div>
        <div className="inline-flex rounded-md border border-slate-300 overflow-hidden text-sm">
          {MODES.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-3 py-1 font-medium ${i > 0 ? 'border-l border-slate-300' : ''} ${
                mode === m.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      {mode === 'top' && <InstallationDiagramPlan {...props} />}
      {mode === 'side' && <InstallationDiagramSide {...props} />}
      {mode === '3d' && <InstallationDiagramIso {...props} />}
    </div>
  )
}
