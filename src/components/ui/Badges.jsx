import { categoryColor } from '../../lib/categories'

const TYPE_STYLES = {
  income: 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/25 dark:bg-green-500/15 dark:text-green-300',
  expense: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/15 dark:text-red-300',
}

export function TypeBadge({ type }) {
  return (
    <span className={`chip ${TYPE_STYLES[type] ?? ''}`}>
      {type === 'income' ? 'Income' : 'Expense'}
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span className="chip border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: categoryColor(category) }}
        aria-hidden
      />
      {category}
    </span>
  )
}
