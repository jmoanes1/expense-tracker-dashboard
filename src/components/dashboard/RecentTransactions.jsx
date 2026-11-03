import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCurrencyFormatter } from '../../context/PrefsContext'
import { categoryColor } from '../../lib/categories'
import { formatDate } from '../../lib/format'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

export function TransactionRow({ transaction }) {
  const money = useCurrencyFormatter()
  const isIncome = transaction.type === 'income'
  const Icon = isIncome ? TrendingUp : TrendingDown

  return (
    <li className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50 sm:px-6 dark:hover:bg-slate-800/50">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
        style={{
          backgroundColor: isIncome ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
          color: isIncome ? '#16a34a' : '#dc2626',
        }}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{transaction.name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColor(transaction.category) }} aria-hidden />
          <span className="truncate">{transaction.category}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0">{formatDate(transaction.date, { month: 'short', day: 'numeric' })}</span>
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className="text-sm font-bold"
          style={{ color: isIncome ? '#16a34a' : '#dc2626' }}
        >
          {isIncome ? '+' : '−'}
          {money(transaction.amount)}
        </p>
        <p className="mt-0.5 hidden text-xs text-slate-400 dark:text-slate-500 sm:block">{transaction.method}</p>
      </div>
    </li>
  )
}

export function RecentTransactions({ transactions, limit = 6 }) {
  const recent = transactions.slice(0, limit)
  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Recent Transactions"
        subtitle="Your latest income and expense records"
        action={
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:gap-2.5 hover:text-blue-700 dark:text-blue-400"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />
      <CardBody className="p-0!">
        {recent.length === 0 ? (
          <EmptyState title="No transactions yet" message="Records you add will appear here." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.map((t) => (
              <TransactionRow key={t.id} transaction={t} />
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
