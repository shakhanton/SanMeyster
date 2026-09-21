import type { ReactNode } from 'react'

export type Verdict = 'ok' | 'warning' | 'fail' | 'unknown'

const ICON: Record<Verdict, string> = {
  ok: '🟢',
  warning: '🟡',
  fail: '🔴',
  unknown: '⚪',
}

const LABEL_CLASS: Record<Verdict, string> = {
  ok: 'text-green-700',
  warning: 'text-amber-700',
  fail: 'text-red-700',
  unknown: 'text-slate-500',
}

export default function VerdictBadge({ verdict, children }: { verdict: Verdict; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium ${LABEL_CLASS[verdict]}`}>
      <span aria-hidden>{ICON[verdict]}</span>
      {children}
    </span>
  )
}
