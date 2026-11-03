import { ArrowDownRight, ArrowUpRight, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useCurrencyFormatter, usePrefs } from '../../context/PrefsContext'
import { formatPercent } from '../../lib/format'

const INCOME_GREEN = '#16a34a'
const EXPENSE_RED = '#dc2626'

function Delta({ value, invertColor = false }) {
  const up = value >= 0
  const positive = invertColor ? !up : up
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold"
      style={{ color: positive ? INCOME_GREEN : EXPENSE_RED }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {up ? '+' : '−'}
      {formatPercent(Math.abs(value))}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, tone, footer }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
    green: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300',
    red: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
  }
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-[1.75rem]">{value}</p>
      {footer ? <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">{footer}</div> : null}
    </div>
  )
}

export function SummaryCards({ totals, monthlyChange, savingsRate }) {
  const money = useCurrencyFormatter()
  const { prefs } = usePrefs()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Balance"
        value={money(totals.balance)}
        icon={Wallet}
        tone="blue"
        footer={<span>Including {money(prefs.openingBalance, { compact: true })} opening balance</span>}
      />
      <StatCard
        label="Total Income"
        value={money(totals.income)}
        icon={TrendingUp}
        tone="green"
        footer={<Delta value={monthlyChange.income} />}
      />
      <StatCard
        label="Total Expenses"
        value={money(totals.expenses)}
        icon={TrendingDown}
        tone="red"
        footer={<Delta value={monthlyChange.expenses} invertColor />}
      />
      <StatCard
        label="Savings"
        value={money(totals.savings)}
        icon={PiggyBank}
        tone="violet"
        footer={<span>Savings rate {formatPercent(savingsRate)}</span>}
      />
    </div>
  )
}
