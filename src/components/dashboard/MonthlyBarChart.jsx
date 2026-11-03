import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useCurrencyFormatter } from '../../context/PrefsContext'
import { monthlySeries } from '../../lib/stats'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { ChartTooltip } from '../charts/ChartTooltip'
import { Segmented } from '../ui/Segmented'

const INCOME = '#16a34a'
const EXPENSE = '#dc2626'

const RANGE_OPTIONS = [
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
]

const legendStyle = { fontSize: 12, paddingTop: 8 }

export function MonthlyBarChart({ transactions, title = 'Income vs Expenses' }) {
  const [months, setMonths] = useState('6')
  const money = useCurrencyFormatter()

  const data = useMemo(() => monthlySeries(transactions, { months: Number(months) }), [transactions, months])

  return (
    <Card>
      <CardHeader
        title={title}
        subtitle="Monthly comparison of money in and money out"
        action={<Segmented aria-label="Chart range" options={RANGE_OPTIONS} value={months} onChange={setMonths} />}
      />
      <CardBody>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => money(v, { compact: true })}
                tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={58}
              />
              <Tooltip cursor={{ fill: 'rgba(100,116,139,0.08)' }} content={<ChartTooltip />} />
              <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
              <Bar dataKey="income" name="Income" fill={INCOME} radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="expenses" name="Expenses" fill={EXPENSE} radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}
