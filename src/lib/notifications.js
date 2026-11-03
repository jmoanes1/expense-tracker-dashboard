import { monthKey, today } from './format'
import { inMonth, summarize } from './stats'

export function buildNotifications(transactions, prefs) {
  const items = []
  const currentKey = monthKey(today())
  const monthTx = inMonth(transactions, currentKey)
  const monthTotals = summarize(monthTx)

  if (prefs.monthlyBudget > 0 && monthTotals.expenses > prefs.monthlyBudget) {
    items.push({
      id: 'budget',
      tone: 'danger',
      title: 'Monthly budget exceeded',
      message: `Spending is above your ${prefs.monthlyBudget.toLocaleString()} budget for this month.`,
      date: today(),
    })
  } else if (prefs.monthlyBudget > 0 && monthTotals.expenses > prefs.monthlyBudget * 0.8) {
    items.push({
      id: 'budget-warning',
      tone: 'info',
      title: 'Approaching budget limit',
      message: 'You have used more than 80% of this month’s budget.',
      date: today(),
    })
  }

  if (monthTotals.savings > 0) {
    items.push({
      id: 'savings',
      tone: 'success',
      title: 'Positive cash flow',
      message: `You saved ${monthTotals.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} this month.`,
      date: today(),
    })
  }

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4)
  for (const t of recent) {
    items.push({
      id: t.id,
      tone: t.type === 'income' ? 'success' : 'info',
      title: `${t.type === 'income' ? 'Income' : 'Expense'} recorded`,
      message: `${t.name} — ${t.amount.toLocaleString()}`,
      date: t.date,
    })
  }

  return items.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8)
}

export function unreadCount(notifications, readAt) {
  return notifications.filter((n) => !readAt || n.date > readAt).length
}
