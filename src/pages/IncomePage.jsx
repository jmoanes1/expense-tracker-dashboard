import { useMemo } from 'react'
import { useCurrencyFormatter } from '../context/PrefsContext'
import { useTransactions } from '../context/TransactionsContext'
import { CategoryDonut } from '../components/dashboard/CategoryDonut'
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart'
import { TransactionsView } from '../components/transactions/TransactionsView'
import { useTransactionManager } from '../hooks/useTransactionManager'
import { INCOME_CATEGORIES } from '../lib/categories'
import { monthKey, today } from '../lib/format'
import { inMonth, summarize } from '../lib/stats'
import { Card, CardBody, CardHeader } from '../components/ui/Card'

export function IncomePage() {
  const { sorted } = useTransactions()
  const money = useCurrencyFormatter()
  const manager = useTransactionManager({ type: 'income', categories: INCOME_CATEGORIES, pageSize: 10 })

  const monthIncome = useMemo(() => summarize(inMonth(sorted, monthKey(today()))).income, [sorted])
  const yearIncome = useMemo(
    () => summarize(sorted.filter((t) => t.date.startsWith(today().slice(0, 4)))).income,
    [sorted],
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader title="This Month" subtitle="Income recorded in the current month" />
          <CardBody>
            <p className="text-2xl font-bold" style={{ color: '#16a34a' }}>{money(monthIncome)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="This Year" subtitle="Total income since January" />
          <CardBody>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{money(yearIncome)}</p>
          </CardBody>
        </Card>
        <CategoryDonut transactions={sorted} type="income" title="Income Sources" />
      </div>

      <MonthlyBarChart transactions={sorted} title="Income vs Expenses" />

      <TransactionsView
        manager={manager}
        title="Income Records"
        subtitle="Every paycheck, payout, and side income. Filter by source, date, or payment method."
        showType={false}
        categories={INCOME_CATEGORIES}
        addLabel="Add Income"
      />
    </div>
  )
}
