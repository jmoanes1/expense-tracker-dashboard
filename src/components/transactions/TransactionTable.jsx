import { BadgeDollarSign, Pencil, ReceiptText, Trash2 } from 'lucide-react'
import { useCurrencyFormatter } from '../../context/PrefsContext'
import { formatDate } from '../../lib/format'
import { CategoryBadge, TypeBadge } from '../ui/Badges'
import { IconButton } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'

export function TransactionTable({ transactions, onEdit, onDelete, emptyTitle = 'No transactions found', emptyMessage }) {
  const money = useCurrencyFormatter()

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={ReceiptText}
        title={emptyTitle}
        message={emptyMessage ?? 'Try adjusting your search or filters, or add a new transaction.'}
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse">
        <thead>
          <tr className="table-head">
            <th scope="col" className="table-cell rounded-tl-xl">Transaction</th>
            <th scope="col" className="table-cell">Category</th>
            <th scope="col" className="table-cell">Date</th>
            <th scope="col" className="table-cell hidden md:table-cell">Method</th>
            <th scope="col" className="table-cell hidden sm:table-cell">Type</th>
            <th scope="col" className="table-cell text-right">Amount</th>
            <th scope="col" className="table-cell rounded-tr-xl text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((t) => {
            const isIncome = t.type === 'income'
            return (
              <tr key={t.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                      style={{
                        backgroundColor: isIncome ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                        color: isIncome ? '#16a34a' : '#dc2626',
                      }}
                    >
                      <BadgeDollarSign className="h-4.5 w-4.5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
                      {t.note ? <p className="max-w-56 truncate text-xs text-slate-400 dark:text-slate-500">{t.note}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="table-cell"><CategoryBadge category={t.category} /></td>
                <td className="table-cell whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="table-cell hidden whitespace-nowrap md:table-cell">{t.method}</td>
                <td className="table-cell hidden sm:table-cell"><TypeBadge type={t.type} /></td>
                <td
                  className="table-cell whitespace-nowrap text-right font-bold"
                  style={{ color: isIncome ? '#16a34a' : '#dc2626' }}
                >
                  {isIncome ? '+' : '−'}
                  {money(t.amount)}
                </td>
                <td className="table-cell">
                  <div className="flex justify-end gap-1">
                    <IconButton label={`Edit ${t.name}`} icon={Pencil} onClick={() => onEdit(t)} />
                    <IconButton
                      label={`Delete ${t.name}`}
                      icon={Trash2}
                      variant="ghost"
                      className="text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400"
                      onClick={() => onDelete(t)}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
