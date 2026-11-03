import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { uid } from '../lib/format'
import { buildSeedTransactions } from '../lib/seed'
import { KEYS, readJSON, writeJSON } from '../lib/storage'
import { summarize } from '../lib/stats'
import { usePrefs } from './PrefsContext'

const TransactionsContext = createContext(null)

function normalize(tx, index) {
  return {
    id: tx.id ?? uid() + index,
    type: tx.type === 'income' ? 'income' : 'expense',
    name: String(tx.name ?? '').trim() || 'Untitled',
    amount: Math.max(0, Number(tx.amount) || 0),
    category: String(tx.category ?? 'Other'),
    date: /^\d{4}-\d{2}-\d{2}$/.test(tx.date ?? '') ? tx.date : new Date().toISOString().slice(0, 10),
    method: String(tx.method ?? 'Cash'),
    note: String(tx.note ?? ''),
    createdAt: tx.createdAt ?? new Date().toISOString(),
  }
}

function initialTransactions() {
  const stored = readJSON(KEYS.transactions, null)
  if (Array.isArray(stored)) return stored.map(normalize)
  const seed = buildSeedTransactions()
  writeJSON(KEYS.transactions, seed)
  return seed
}

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [lastEvent, setLastEvent] = useState(null)

  useEffect(() => {
    writeJSON(KEYS.transactions, transactions)
  }, [transactions])

  const notify = useCallback((message, tone = 'success') => {
    setLastEvent({ message, tone, id: uid() })
  }, [])

  const addTransaction = useCallback(
    (draft) => {
      const tx = normalize({ ...draft, id: uid() }, 0)
      setTransactions((prev) => [tx, ...prev])
      notify(tx.type === 'income' ? 'Income added' : 'Expense added')
      return tx
    },
    [notify],
  )

  const updateTransaction = useCallback(
    (id, draft) => {
      setTransactions((prev) => prev.map((tx) => (tx.id === id ? normalize({ ...tx, ...draft, id }, 0) : tx)))
      notify('Transaction updated')
    },
    [notify],
  )

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id))
      notify('Transaction deleted', 'danger')
    },
    [notify],
  )

  const loadSampleData = useCallback(() => {
    setTransactions(buildSeedTransactions())
    notify('Sample data restored')
  }, [notify])

  const clearAll = useCallback(() => {
    setTransactions([])
    notify('All transactions cleared', 'danger')
  }, [notify])

  const value = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    return {
      transactions,
      sorted,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      loadSampleData,
      clearAll,
      lastEvent,
      notify,
      dismissEvent: () => setLastEvent(null),
    }
  }, [transactions, addTransaction, updateTransaction, deleteTransaction, loadSampleData, clearAll, lastEvent, notify])

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext)
  if (!ctx) throw new Error('useTransactions must be used inside TransactionsProvider')
  return ctx
}

export function useTotals(transactions) {
  const { prefs } = usePrefs()
  return useMemo(() => summarize(transactions, prefs.openingBalance), [transactions, prefs.openingBalance])
}
