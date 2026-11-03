import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useTransactions, useTotals } from '../context/TransactionsContext'
import { monthOverMonthChange, monthlySeries } from '../lib/stats'
import { CategoryDonut } from '../components/dashboard/CategoryDonut'
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { TransactionFormModal } from '../components/transactions/TransactionFormModal'
import { useTransactionManager } from '../hooks/useTransactionManager'
import { Button } from '../components/ui/Button'

export function DashboardPage() {
  const { sorted } = useTransactions()
  const totals = useTotals(sorted)
  const manager = useTransactionManager()

  const series = useMemo(() => monthlySeries(sorted, { months: 12 }), [sorted])
  const change = useMemo(() => monthOverMonthChange(series), [series])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back — here is what your money has been doing.
        </p>
        <Button icon={Plus} onClick={manager.openAdd}>
          Add Transaction
        </Button>
      </div>

      <SummaryCards totals={totals} monthlyChange={change} savingsRate={totals.savingsRate} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyBarChart transactions={sorted} />
        </div>
        <CategoryDonut transactions={sorted} />
      </div>

      <RecentTransactions transactions={sorted} limit={6} />

      <TransactionFormModal
        open={manager.formOpen}
        onClose={manager.closeForm}
        initial={manager.editing}
      />
    </div>
  )
}
