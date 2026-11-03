import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useCurrencyFormatter } from '../../context/PrefsContext'
import { categoryColor, FALLBACK_COLOR } from '../../lib/categories'
import { formatPercent, monthOffset, today } from '../../lib/format'
import { categoryBreakdown } from '../../lib/stats'
import { EmptyState } from '../ui/EmptyState'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { ChartTooltip } from '../charts/ChartTooltip'
import { Segmented } from '../ui/Segmented'

const RANGES = [
  { value: 'month', label: 'This month' },
  { value: 'quarter', label: '3 months' },
  { value: 'year', label: 'This year' },
  { value: 'all', label: 'All time' },
]

function filterByRange(transactions, range) {
  const now = today()
  const year = now.slice(0, 4)
  if (range === 'month') return transactions.filter((t) => t.date.slice(0, 7) === now.slice(0, 7))
  if (range === 'quarter') return transactions.filter((t) => t.date >= monthOffset(now, -2))
  if (range === 'year') return transactions.filter((t) => t.date.startsWith(year))
  return transactions
}

export function CategoryDonut({ transactions, type = 'expense', title = 'Expense Breakdown' }) {
  const [range, setRange] = useState('month')
  const money = useCurrencyFormatter()

  const data = useMemo(() => {
    const scoped = filterByRange(transactions, range)
    return categoryBreakdown(scoped, type)
  }, [transactions, range, type])

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title={title}
        subtitle={`${type === 'income' ? 'Earnings' : 'Spending'} by category · ${RANGES.find((r) => r.value === range)?.label}`}
        action={<Segmented aria-label="Breakdown range" options={RANGES} value={range} onChange={setRange} />}
      />
      <CardBody className="flex-1">
        {data.length === 0 ? (
          <EmptyState title="Nothing to show yet" message="Add a few transactions to see your category breakdown." />
        ) : (
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <div className="relative h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="62%"
                    outerRadius="95%"
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.category} fill={categoryColor(entry.category) || FALLBACK_COLOR} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Total</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-50">{money(total, { compact: true })}</p>
              </div>
            </div>
            <ul className="w-full flex-1 space-y-2.5">
              {data.slice(0, 7).map((entry) => (
                <li key={entry.category} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: categoryColor(entry.category) || FALLBACK_COLOR }}
                    aria-hidden
                  />
                  <span className="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                    {entry.category}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{money(entry.value)}</span>
                  <span className="w-12 text-right text-xs font-medium text-slate-400 dark:text-slate-500">
                    {formatPercent(entry.percent, 0)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
