export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function today() {
  return toISODate(new Date())
}

/** Shift a YYYY-MM-DD date by N months (day is clamped to the target month length). */
export function monthOffset(iso, months) {
  const [y, m, d] = iso.split('-').map(Number)
  const target = new Date(y, m - 1 + months, 1, 12)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(d, lastDay))
  return toISODate(target)
}

export function monthKey(iso) {
  return iso.slice(0, 7)
}

export function monthLabel(key, style = 'short') {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1, 12).toLocaleDateString('en-US', {
    month: style,
    ...(style === 'long' ? { year: 'numeric' } : { year: '2-digit' }),
  })
}

export function formatDate(iso, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d, 12).toLocaleDateString('en-US', opts)
}

export function formatLongDate(date = new Date(), opts) {
  return date.toLocaleDateString(
    'en-US',
    opts ?? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  )
}

export function formatMoney(value, currency = 'USD', opts = {}) {
  const { compact = false, signed = false } = opts
  const amount = Number.isFinite(value) ? value : 0
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 2,
    minimumFractionDigits: compact ? 0 : 2,
  }).format(Math.abs(amount))
  if (signed) return `${amount < 0 ? '−' : '+'}${formatted}`
  return amount < 0 ? `−${formatted}` : formatted
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Math.round(Number(value) || 0))
}

export function formatPercent(value, digits = 1) {
  if (!Number.isFinite(value)) return '0%'
  return `${value.toFixed(digits)}%`
}
