import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useCurrencyFormatter, usePrefs } from '../context/PrefsContext'
import { useTransactions, useTotals } from '../context/TransactionsContext'
import { formatPercent, today } from '../lib/format'
import { categoryBreakdown, monthlySeries, topExpenses, yearlySeries } from '../lib/stats'
import { ChartTooltip } from '../components/charts/ChartTooltip'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Segmented } from '../components/ui/Segmented'

const INCOME = '#16a34a'
const EXPENSE = '#dc2626'

function YearlyTotals({ transactions }) {
  const money = useCurrencyFormatter()
  const year = today().slice(0, 4)
  const scoped = useMemo(() => transactions.filter((t) => t.date.startsWith(year)), [transactions, year])
  const { income, expenses, savings, savingsRate } = useMemo(() => {
    let inc = 0
    let exp = 0
    for (const t of scoped) {
      if (t.type === 'income') inc += t.amount
      else exp += t.amount
    }
    const sav = inc - exp
    return { income: inc, expenses: exp, savings: sav, savingsRate: inc > 0 ? (sav / inc) * 100 : 0 }
  }, [scoped])

  const stats = [
    { label: `Income (${year})`, value: money(income), color: INCOME },
    { label: `Expenses (${year})`, value: money(expenses), color: EXPENSE },
    { label: 'Net Savings', value: money(savings), color: '#2563eb' },
    { label: 'Savings Rate', value: formatPercent(savingsRate), color: '#7c3aed' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{s.label}</p>
          <p className="mt-1.5 text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

export function ReportsPage() {
  const { sorted } = useTransactions()
  const totals = useTotals(sorted)
  const money = useCurrencyFormatter()
  const { prefs } = usePrefs()
  const [chartView, setChartView] = useState('savings')

  const months = useMemo(() => monthlySeries(sorted, { months: 12 }), [sorted])
  const years = useMemo(() => yearlySeries(sorted), [sorted])
  const top = useMemo(() => topExpenses(sorted, 5), [sorted])
  const breakdown = useMemo(() => categoryBreakdown(sorted, 'expense'), [sorted])

  return (
    <div className="space-y-6">
      <YearlyTotals transactions={sorted} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Savings Trend"
            subtitle="Net cash flow (income minus expenses) per month"
            action={
              <Segmented
                aria-label="Report chart"
                options={[
                  { value: 'savings', label: 'Net flow' },
                  { value: 'expenses', label: 'Expenses' },
                  { value: 'income', label: 'Income' },
                ]}
                value={chartView}
                onChange={setChartView}
              />
            }
          />
          <CardBody>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={months} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartView === 'expenses' ? EXPENSE : INCOME} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={chartView === 'expenses' ? EXPENSE : INCOME} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--chart-text)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(v) => money(v, { compact: true })}
                    tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={58}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey={chartView === 'savings' ? 'net' : chartView}
                    name={chartView === 'savings' ? 'Net savings' : chartView === 'expenses' ? 'Expenses' : 'Income'}
                    stroke={chartView === 'expenses' ? EXPENSE : INCOME}
                    strokeWidth={2.5}
                    fill="url(#fillTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title="Top Expenses" subtitle="Your five largest expense records" />
          <CardBody className="flex-1">
            {top.length === 0 ? (
              <EmptyState title="No expenses yet" message="Your largest purchases will be listed here." />
            ) : (
              <ol className="space-y-3">
                {top.map((t, index) => (
                  <li key={t.id} className="flex items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.category}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold" style={{ color: EXPENSE }}>{money(t.amount)}</p>
                  </li>
                ))}
              </ol>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader title="Monthly Summary" subtitle="Last 12 months at a glance" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse">
              <thead>
                <tr className="table-head">
                  <th scope="col" className="table-cell rounded-tl-xl">Month</th>
                  <th scope="col" className="table-cell text-right">Income</th>
                  <th scope="col" className="table-cell text-right">Expenses</th>
                  <th scope="col" className="table-cell text-right">Net</th>
                  <th scope="col" className="table-cell rounded-tr-xl text-right">Savings rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {months.map((m) => (
                  <tr key={m.key} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="table-cell font-semibold text-slate-900 dark:text-slate-100">{m.label}</td>
                    <td className="table-cell text-right" style={{ color: INCOME }}>{money(m.income)}</td>
                    <td className="table-cell text-right" style={{ color: EXPENSE }}>{money(m.expenses)}</td>
                    <td className="table-cell text-right font-semibold" style={{ color: m.net >= 0 ? INCOME : EXPENSE }}>
                      {money(m.net)}
                    </td>
                    <td className="table-cell text-right">{formatPercent(m.income > 0 ? (m.net / m.income) * 100 : 0, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Yearly Summary" subtitle="Totals per year" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[18rem] border-collapse">
              <thead>
                <tr className="table-head">
                  <th scope="col" className="table-cell rounded-tl-xl">Year</th>
                  <th scope="col" className="table-cell text-right">Income</th>
                  <th scope="col" className="table-cell rounded-tr-xl text-right">Expenses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {years.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="table-cell py-8 text-center">No data yet</td>
                  </tr>
                ) : (
                  years.map((y) => (
                    <tr key={y.key}>
                      <td className="table-cell font-semibold text-slate-900 dark:text-slate-100">{y.label}</td>
                      <td className="table-cell text-right" style={{ color: INCOME }}>{money(y.income)}</td>
                      <td className="table-cell text-right" style={{ color: EXPENSE }}>{money(y.expenses)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="All-Time Overview" subtitle="Across every saved transaction" />
        <CardBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total income</p>
              <p className="mt-1 text-xl font-bold" style={{ color: INCOME }}>{money(totals.income)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total expenses</p>
              <p className="mt-1 text-xl font-bold" style={{ color: EXPENSE }}>{money(totals.expenses)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Transactions saved</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">{totals.count}</p>
            </div>
          </div>
          {breakdown.length > 0 ? (
            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Largest categories (all time)
              </p>
              <div className="space-y-3">
                {breakdown.slice(0, 4).map((c) => (
                  <div key={c.category}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{c.category}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {money(c.value)} · {formatPercent(c.percent, 0)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${c.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <p className="mt-5 text-xs text-slate-400 dark:text-slate-500">
            Includes an opening balance of {money(prefs.openingBalance)} configured in Settings.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
