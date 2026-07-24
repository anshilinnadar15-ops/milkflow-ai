// Small formatting helpers shared across pages.

export const formatNumber = (value) => {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-IN').format(value)
}

export const formatLiters = (value) => `${formatNumber(value)} L`

export const formatMinutes = (value) => `${value} min`

export const formatPercent = (value) => `${value}%`

export const statusColors = {
  completed: { bg: 'bg-success-50', text: 'text-success', dot: 'bg-success' },
  'in-progress': { bg: 'bg-primary-50', text: 'text-primary', dot: 'bg-primary' },
  delayed: { bg: 'bg-danger-50', text: 'text-danger', dot: 'bg-danger' },
  pending: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
  running: { bg: 'bg-success-50', text: 'text-success', dot: 'bg-success' },
  idle: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
  warning: { bg: 'bg-warning-50', text: 'text-warning', dot: 'bg-warning' },
  Critical: { bg: 'bg-danger-50', text: 'text-danger', dot: 'bg-danger' },
  Moderate: { bg: 'bg-warning-50', text: 'text-warning', dot: 'bg-warning' },
  Minor: { bg: 'bg-primary-50', text: 'text-primary', dot: 'bg-primary' },
  Pending: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
}

export const riskColors = {
  Low: 'text-success bg-success-50',
  Medium: 'text-warning bg-warning-50',
  High: 'text-danger bg-danger-50',
}
