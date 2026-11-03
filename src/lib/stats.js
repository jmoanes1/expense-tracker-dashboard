import { monthKey, monthLabel, monthOffset, toISODate } from './format'

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100

export function summarize(transactions, openingBalance = 0) {
  let income = 0
  let expenses = 0
  for (const t of transactions) {
    const amount = Number(t.amount) || 0
    if (t.type === 'income') income += amount
    else expenses += amount
  }
  income = round2(income)
  expenses = round2(expenses)
  const savings = round2(income - expenses)
  return {
    income,
    expenses,
    savings,
    balance: round2(savings + openingBalance),
    savingsRate: income > 0 ? (savings / income) * 100 : 0,
    count: transactions.length,
  }
}

/** Consecutive month keys ending at `refISO`, oldest first. */
export function recentMonthKeys(count = 12, refISO = toISODate(new Date())) {
  const keys = []
  for (let i = count - 1; i >= 0; i -= 1) keys.push(monthKey(monthOffset(refISO, -i)))
  return keys
}

export function monthlySeries(transactions, { months = 12, refISO } = {}) {
  const keys = recentMonthKeys(months, refISO)
  const buckets = new Map(keys.map((k) => [k, { key: k, income: 0, expenses: 0 }]))
  for (const t of transactions) {
    const bucket = buckets.get(monthKey(t.date))
    if (!bucket) continue
    const amount = Number(t.amount) || 0
    if (t.type === 'income') bucket.income += amount
    else bucket.expenses += amount
  }
  return keys.map((k) => {
    const b = buckets.get(k)
    return {
      key: k,
      label: monthLabel(k),
      income: round2(b.income),
      expenses: round2(b.expenses),
      net: round2(b.income - b.expenses),
    }
  })
}

export function yearlySeries(transactions) {
  const buckets = new Map()
  for (const t of transactions) {
    const year = t.date.slice(0, 4)
    if (!year) continue
    const b = buckets.get(year) ?? { key: year, label: year, income: 0, expenses: 0 }
    const amount = Number(t.amount) || 0
    if (t.type === 'income') b.income += amount
    else b.expenses += amount
    buckets.set(year, b)
  }
  return [...buckets.values()]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((b) => ({ ...b, income: round2(b.income), expenses: round2(b.expenses), net: round2(b.income - b.expenses) }))
}

export function categoryBreakdown(transactions, type = 'expense') {
  const totals = new Map()
  for (const t of transactions) {
    if (t.type !== type) continue
    const key = t.category || 'Other'
    totals.set(key, (totals.get(key) ?? 0) + (Number(t.amount) || 0))
  }
  const total = [...totals.values()].reduce((sum, v) => sum + v, 0)
  return [...totals.entries()]
    .map(([category, value]) => ({
      category,
      name: category,
      value: round2(value),
      percent: total > 0 ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
}

export function topExpenses(transactions, limit = 5) {
  return transactions
    .filter((t) => t.type === 'expense')
    .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
    .slice(0, limit)
}

export function averageMonthlyExpense(transactions, months = 12) {
  const series = monthlySeries(transactions, { months })
  const withData = series.filter((m) => m.income > 0 || m.expenses > 0)
  const span = withData.length || 1
  return round2(withData.reduce((sum, m) => sum + m.expenses, 0) / span)
}

export function filterTransactions(transactions, filters = {}) {
  const { search = '', type = 'all', category = 'all', method = 'all', from = '', to = '', sort = 'date-desc' } = filters
  const term = search.trim().toLowerCase()

  let out = transactions.filter((t) => {
    if (type !== 'all' && t.type !== type) return false
    if (category !== 'all' && t.category !== category) return false
    if (method !== 'all' && t.method !== method) return false
    if (from && t.date < from) return false
    if (to && t.date > to) return false
    if (term) {
      const haystack = `${t.name} ${t.category} ${t.method} ${t.note ?? ''}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })

  const sorters = {
    'date-desc': (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
    'date-asc': (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
    'amount-desc': (a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0),
    'amount-asc': (a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0),
    name: (a, b) => a.name.localeCompare(b.name),
  }
  out = [...out].sort(sorters[sort] ?? sorters['date-desc'])
  return out
}

export function inMonth(transactions, key) {
  return transactions.filter((t) => monthKey(t.date) === key)
}

export function monthOverMonthChange(series) {
  if (series.length < 2) return { expenses: 0, income: 0 }
  const current = series[series.length - 1]
  const previous = series[series.length - 2]
  const pct = (now, before) => (before > 0 ? ((now - before) / before) * 100 : now > 0 ? 100 : 0)
  return {
    expenses: pct(current.expenses, previous.expenses),
    income: pct(current.income, previous.income),
  }
}
