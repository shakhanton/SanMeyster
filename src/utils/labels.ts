import type { InstallationType, Jurisdiction, RuleType } from '../data/types'

export const installationTypeLabels: Record<InstallationType, string> = {
  countertop: 'Накладна',
  inset: 'Врізна',
  undermount: 'Підстільна (undermount)',
  'wall-mounted': 'Настінна',
  furniture: 'Меблева',
}

export const jurisdictionLabels: Record<Jurisdiction, string> = {
  UA: 'Україна (ДБН)',
  EU: 'ЄС (EN)',
  DE: 'Німеччина (DIN)',
  ISO: 'ISO',
  professional: 'Професійні (NKBA)',
  manufacturer: 'Виробник',
}

export const ruleTypeLabels: Record<RuleType, string> = {
  mandatory: "Обов'язкова вимога",
  recommended: 'Рекомендація',
  ergonomic: 'Ергономіка',
  manufacturer: 'Виробник',
  calculated: 'Розраховано',
  heuristic: 'Евристика',
}

export function formatSourced(v: { value: number; unit: string | null } | null | undefined): string {
  if (!v) return '—'
  return v.unit ? `${v.value} ${v.unit}` : String(v.value)
}
