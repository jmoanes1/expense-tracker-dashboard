import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useCurrencyFormatter } from '../../context/PrefsContext'
import { summarize } from '../../lib/stats'
import { Button, IconButton } from '../ui/Button'
import { Card, CardBody, CardHeader } from '../ui/Card'
import { ConfirmDialog } from '../ui/Modal'
import { TransactionFilters } from '../transactions/TransactionFilters'
import { TransactionFormModal } from '../transactions/TransactionFormModal'
import { TransactionTable } from '../transactions/TransactionTable'

export function TransactionsView({
  manager,
  title,
  subtitle,
  showType = true,
  categories = null,
  addLabel = 'Add Transaction',
}) {
  const money = useCurrencyFormatter()
  const scoped = manager.filtered
  const totals = summarize(scoped)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        <Button icon={Plus} onClick={manager.openAdd}>
          {addLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Records</p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">{manager.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Filtered income</p>
          <p className="mt-1 text-xl font-bold" style={{ color: '#16a34a' }}>{money(totals.income)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Filtered expenses</p>
          <p className="mt-1 text-xl font-bold" style={{ color: '#dc2626' }}>{money(totals.expenses)}</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title={title} subtitle="Search, filter, and manage every record" />
        <CardBody className="space-y-5">
          <TransactionFilters
            filters={manager.filters}
            onChange={manager.updateFilters}
            onReset={manager.resetFilters}
            categories={categories}
            showType={showType}
          />
          <div className="-mx-5 -my-5 overflow-hidden sm:-mx-6 sm:-my-6">
            <TransactionTable
              transactions={manager.paged}
              onEdit={manager.openEdit}
              onDelete={manager.setPendingDelete}
            />
          </div>
          {manager.totalPages > 1 ? (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Page {manager.page} of {manager.totalPages} · {manager.total} records
              </p>
              <div className="flex gap-2">
                <IconButton
                  label="Previous page"
                  icon={ChevronLeft}
                  variant="secondary"
                  disabled={manager.page <= 1}
                  onClick={() => manager.setPage(manager.page - 1)}
                />
                <IconButton
                  label="Next page"
                  icon={ChevronRight}
                  variant="secondary"
                  disabled={manager.page >= manager.totalPages}
                  onClick={() => manager.setPage(manager.page + 1)}
                />
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>

      <TransactionFormModal open={manager.formOpen} onClose={manager.closeForm} initial={manager.editing} />
      <ConfirmDialog
        open={Boolean(manager.pendingDelete)}
        onClose={() => manager.setPendingDelete(null)}
        onConfirm={manager.confirmDelete}
        title="Delete transaction"
        message={`“${manager.pendingDelete?.name}” will be permanently removed from your records.`}
      />
    </div>
  )
}
