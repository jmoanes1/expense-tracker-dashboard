import { useMemo } from 'react'
import { useCurrencyFormatter, usePrefs } from '../context/PrefsContext'
import { useTransactions } from '../context/TransactionsContext'
import { formatPercent, monthKey, today } from '../lib/format'
import { averageMonthlyExpense, inMonth, summarize } from '../lib/stats'
import { CategoryDonut } from '../components/dashboard/CategoryDonut'
import { TransactionsView } from '../components/transactions/TransactionsView'
import { useTransactionManager } from '../hooks/useTransactionManager'
import { EXPENSE_CATEGORIES } from '../lib/categories'
import { Card, CardBody, CardHeader } from '../components/ui/Card'

function BudgetCard({ expenses }) {
  const { prefs } = usePrefs()
  const money = useCurrencyFormatter()
  const budget = Number(prefs.monthlyBudget) || 0
  if (budget <= 0) return null

  const pct = Math.min(100, (expenses / budget) * 100)
  const over = expenses > budget

  return (
    <Card>
      <CardHeader title="This Month's Budget" subtitle="Spending against your monthly limit" />
      <CardBody>
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{money(expenses)}</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">of {money(budget)}</p>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: over ? '#dc2626' : '#2563eb' }}
          />
        </div>
        <p className={`mt-2 text-xs font-semibold ${over ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {over
            ? `Over budget by ${money(expenses - budget)}`
            : `${money(budget - expenses)} left · ${formatPercent(100 - pct, 0)} remaining`}
        </p>
      </CardBody>
    </Card>
  )
}

export function ExpensesPage() {
  const { sorted } = useTransactions()
  const money = useCurrencyFormatter()
  const manager = useTransactionManager({ type: 'expense', categories: EXPENSE_CATEGORIES, pageSize: 10 })

  const monthExpenses = useMemo(() => summarize(inMonth(sorted, monthKey(today()))).expenses, [sorted])
  const avgMonthly = useMemo(() => averageMonthlyExpense(sorted, 12), [sorted])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BudgetCard expenses={monthExpenses} />
        <Card>
          <CardHeader title="This Month" subtitle="Expenses recorded in the current month" />
          <CardBody>
            <p className="text-2xl font-bold" style={{ color: '#dc2626' }}>
              {money(monthExpenses)}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Updated automatically as you add records
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Monthly Average" subtitle="Average spending over the last 12 months" />
          <CardBody>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{money(avgMonthly)}</p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Based on months with activity
            </p>
          </CardBody>
        </Card>
      </div>

      <CategoryDonut transactions={sorted} type="expense" title="Expense Breakdown" />

      <TransactionsView
        manager={manager}
        title="Expense Records"
        subtitle="Track where your money goes. Filter by category, date range, or payment method."
        showType={false}
        categories={EXPENSE_CATEGORIES}
        addLabel="Add Expense"
      />
    </div>
  )
}
