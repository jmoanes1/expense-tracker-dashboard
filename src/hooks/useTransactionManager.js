import { useMemo, useState } from 'react'
import { useTransactions } from '../context/TransactionsContext'
import { filterTransactions } from '../lib/stats'

const DEFAULT_FILTERS = {
  search: '',
  type: 'all',
  category: 'all',
  method: 'all',
  from: '',
  to: '',
  sort: 'date-desc',
}

export function useTransactionManager({ type = null, categories = null, pageSize = 10 } = {}) {
  const { sorted, deleteTransaction } = useTransactions()
  const [filters, setFilters] = useState(() =>
    type ? { ...DEFAULT_FILTERS, type } : { ...DEFAULT_FILTERS },
  )
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [page, setPage] = useState(1)

  const effectiveFilters = useMemo(
    () => (categories ? { ...filters, category: categories.includes(filters.category) || filters.category === 'all' ? filters.category : 'all' } : filters),
    [filters, categories],
  )

  const filtered = useMemo(() => filterTransactions(sorted, effectiveFilters), [sorted, effectiveFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (tx) => {
    setEditing(tx)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const confirmDelete = () => {
    if (pendingDelete) deleteTransaction(pendingDelete.id)
    setPendingDelete(null)
  }

  const updateFilters = (next) => {
    setFilters(next)
    setPage(1)
  }

  const resetFilters = () => {
    setFilters(type ? { ...DEFAULT_FILTERS, type } : DEFAULT_FILTERS)
    setPage(1)
  }

  return {
    filtered,
    paged,
    total: filtered.length,
    page: safePage,
    totalPages,
    setPage,
    filters: effectiveFilters,
    updateFilters,
    resetFilters,
    formOpen,
    editing,
    openAdd,
    openEdit,
    closeForm,
    pendingDelete,
    setPendingDelete,
    confirmDelete,
  }
}
