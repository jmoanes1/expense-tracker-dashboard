export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Bills',
  'Healthcare',
  'Entertainment',
  'Education',
  'Other',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Business',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
]

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
  'UPI',
  'Wallet',
]

export const CATEGORIES_BY_TYPE = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
}

export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transportation: '#2563eb',
  Shopping: '#ec4899',
  Bills: '#6366f1',
  Healthcare: '#14b8a6',
  Entertainment: '#8b5cf6',
  Education: '#0ea5e9',
  Salary: '#16a34a',
  Business: '#22c55e',
  Freelance: '#4ade80',
  Investment: '#0d9488',
  Gift: '#a3e635',
  Other: '#64748b',
}

export const FALLBACK_COLOR = '#94a3b8'

export function categoryColor(category) {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLOR
}

export function categoriesFor(type) {
  return CATEGORIES_BY_TYPE[type] ?? EXPENSE_CATEGORIES
}
