import { useEffect, useState } from 'react'
import { useTransactions } from '../../context/TransactionsContext'
import { categoriesFor, PAYMENT_METHODS } from '../../lib/categories'
import { today } from '../../lib/format'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Field'
import { Modal } from '../ui/Modal'
import { Segmented } from '../ui/Segmented'

const BLANK = {
  type: 'expense',
  name: '',
  amount: '',
  category: 'Food',
  date: today(),
  method: PAYMENT_METHODS[0],
  note: '',
}

export function TransactionFormModal({ open, onClose, initial = null }) {
  const { addTransaction, updateTransaction } = useTransactions()
  const [draft, setDraft] = useState(BLANK)
  const [errors, setErrors] = useState({})
  const editing = Boolean(initial)

  useEffect(() => {
    if (!open) return
    setErrors({})
    if (initial) {
      setDraft({ ...BLANK, ...initial, amount: String(initial.amount ?? '') })
    } else {
      setDraft(BLANK)
    }
  }, [open, initial])

  const set = (key) => (e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))

  const changeType = (type) => {
    setDraft((prev) => ({
      ...prev,
      type,
      category: categoriesFor(type).includes(prev.category) ? prev.category : categoriesFor(type)[0],
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!draft.name.trim()) next.name = 'Enter a transaction name.'
    const amount = Number(draft.amount)
    if (!draft.amount || Number.isNaN(amount) || amount <= 0) next.amount = 'Enter an amount greater than zero.'
    if (!draft.date) next.date = 'Pick a date.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const payload = {
      type: draft.type,
      name: draft.name.trim(),
      amount: Math.round(amount * 100) / 100,
      category: draft.category,
      date: draft.date,
      method: draft.method,
      note: draft.note.trim(),
    }
    if (editing) updateTransaction(initial.id, payload)
    else addTransaction(payload)
    onClose()
  }

  const categories = categoriesFor(draft.type)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Transaction' : 'Add Transaction'}
      description={editing ? 'Update the details of this record.' : 'Record a new income or expense.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>{editing ? 'Save changes' : 'Add transaction'}</Button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={submit} noValidate>
        <div className="flex justify-center">
          <Segmented
            aria-label="Transaction type"
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
            ]}
            value={draft.type}
            onChange={changeType}
          />
        </div>

        <Field label="Name" error={errors.name}>
          <Input
            value={draft.name}
            onChange={set('name')}
            placeholder={draft.type === 'income' ? 'e.g. Monthly salary' : 'e.g. Weekly groceries'}
            autoFocus
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Amount" error={errors.amount}>
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={draft.amount}
              onChange={set('amount')}
              placeholder="0.00"
            />
          </Field>
          <Field label="Date" error={errors.date}>
            <Input type="date" value={draft.date} onChange={set('date')} max={today()} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category">
            <Select value={draft.category} onChange={set('category')} options={categories} />
          </Field>
          <Field label="Payment method">
            <Select value={draft.method} onChange={set('method')} options={PAYMENT_METHODS} />
          </Field>
        </div>

        <Field label="Note" hint="Optional — extra context for this record.">
          <Textarea value={draft.note} onChange={set('note')} placeholder="Anything worth remembering…" />
        </Field>
      </form>
    </Modal>
  )
}
