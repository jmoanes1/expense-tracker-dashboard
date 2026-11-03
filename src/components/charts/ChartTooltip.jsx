import { useCurrencyFormatter } from '../../context/PrefsContext'

/**
 * Shared Recharts tooltip that respects the saved currency and dark mode.
 */
export function ChartTooltip({ active, payload, label, labelPrefix = '' }) {
  const money = useCurrencyFormatter()
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <p className="mb-1 text-xs font-semibold text-slate-900 dark:text-slate-100">
        {labelPrefix}
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: entry.color ?? entry.payload?.fill }} aria-hidden />
          <span className="capitalize">{entry.name ?? entry.dataKey}:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{money(entry.value)}</span>
        </p>
      ))}
    </div>
  )
}
