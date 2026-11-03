import { Filter, RotateCcw, Search } from 'lucide-react'
import { categoriesFor, PAYMENT_METHODS } from '../../lib/categories'
import { Field, Input, Select } from '../ui/Field'
import { Segmented } from '../ui/Segmented'

export function TransactionFilters({ filters, onChange, onReset, categories, showType = true }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })
  const type = filters.type ?? 'all'
  const categoryOptions = categories ?? [...new Set([...categoriesFor('expense'), ...categoriesFor('income')])]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <Input
            className="pl-10"
            value={filters.search}
            onChange={set('search')}
            placeholder="Search by name, category, or method…"
            aria-label="Search transactions"
          />
        </div>
        {showType ? (
          <Segmented
            aria-label="Transaction type filter"
            options={[
              { value: 'all', label: 'All' },
              { value: 'expense', label: 'Expenses' },
              { value: 'income', label: 'Income' },
            ]}
            value={type}
            onChange={(value) => onChange({ ...filters, type: value })}
          />
        ) : null}
      </div>

      <details className="group rounded-xl border border-slate-200 bg-white open:bg-white dark:border-slate-800 dark:bg-slate-900">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
          <Filter className="h-4 w-4 text-slate-400" aria-hidden />
          Filters
          <span className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              onClick={(e) => {
                e.preventDefault()
                onReset()
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Reset
            </button>
            <span className="text-xs font-medium text-slate-400 transition group-open:rotate-180" aria-hidden>▾</span>
          </span>
        </summary>
        <div className="grid gap-4 border-t border-slate-100 px-4 py-4 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Category">
            <Select value={filters.category} onChange={set('category')} options={['all', ...categoryOptions]} />
          </Field>
          <Field label="Payment method">
            <Select value={filters.method} onChange={set('method')} options={['all', ...PAYMENT_METHODS]} />
          </Field>
          <Field label="From date">
            <Input type="date" value={filters.from} onChange={set('from')} />
          </Field>
          <Field label="To date">
            <Input type="date" value={filters.to} onChange={set('to')} />
          </Field>
          <Field label="Sort by" className="sm:col-span-2">
            <Select
              value={filters.sort}
              onChange={set('sort')}
              options={[
                { value: 'date-desc', label: 'Newest first' },
                { value: 'date-asc', label: 'Oldest first' },
                { value: 'amount-desc', label: 'Amount: high to low' },
                { value: 'amount-asc', label: 'Amount: low to high' },
                { value: 'name', label: 'Name (A–Z)' },
              ]}
            />
          </Field>
        </div>
      </details>
    </div>
  )
}
