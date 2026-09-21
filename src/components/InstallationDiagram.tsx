import { useState } from 'react'
import type { DiagramData } from './diagram-types'
import InstallationDiagramPlan from './InstallationDiagramPlan'
import InstallationDiagramIso from './InstallationDiagramIso'

export type { DiagramData } from './diagram-types'

export default function InstallationDiagram(props: DiagramData) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d')

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
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
          <button
            type="button"
            onClick={() => setMode('2d')}
            className={`px-3 py-1 font-medium ${mode === '2d' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            2D (зверху)
          </button>
          <button
            type="button"
            onClick={() => setMode('3d')}
            className={`px-3 py-1 font-medium border-l border-slate-300 ${mode === '3d' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            3D
          </button>
        </div>
      </div>
      {mode === '2d' ? <InstallationDiagramPlan {...props} /> : <InstallationDiagramIso {...props} />}
    </div>
  )
}
