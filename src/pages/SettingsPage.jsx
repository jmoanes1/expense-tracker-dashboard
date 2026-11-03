import { useState } from 'react'
import { DatabaseBackup, Download, Moon, Sun, Trash2, UserRound } from 'lucide-react'
import { useCurrencyFormatter, usePrefs } from '../context/PrefsContext'
import { useTransactions } from '../context/TransactionsContext'
import { Button } from '../components/ui/Button'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { Field, Input, Select, Toggle } from '../components/ui/Field'
import { ConfirmDialog } from '../components/ui/Modal'

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
]

export function SettingsPage() {
  const { prefs, setPref, isDark, toggleTheme, resetPrefs } = usePrefs()
  const { sorted, loadSampleData, clearAll } = useTransactions()
  const money = useCurrencyFormatter()
  const [confirm, setConfirm] = useState(null)
  const [profile, setProfile] = useState({ userName: prefs.userName, userEmail: prefs.userEmail })

  const updateProfile = (key) => (e) => {
    setProfile((prev) => ({ ...prev, [key]: e.target.value }))
    setPref(key, e.target.value)
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ prefs, transactions: sorted }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `fintrack-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader title="Profile" subtitle="Shown in the header and notifications" />
        <CardBody className="space-y-5">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
              {prefs.userName.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{prefs.userName}</p>
              <p className="flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
                <UserRound className="h-3.5 w-3.5" aria-hidden />
                Personal account · local data only
              </p>
            </div>
          </div>
          <Field label="Full name">
            <Input value={profile.userName} onChange={updateProfile('userName')} placeholder="Your name" />
          </Field>
          <Field label="Email">
            <Input type="email" value={profile.userEmail} onChange={updateProfile('userEmail')} placeholder="you@example.com" />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Appearance & Currency" subtitle="Saved automatically to this browser" />
        <CardBody className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dark mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
            </div>
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="h-4 w-4 text-slate-400" aria-hidden /> : <Sun className="h-4 w-4 text-slate-400" aria-hidden />}
              <Toggle checked={isDark} onChange={toggleTheme} label="Toggle dark mode" />
            </div>
          </div>
          <Field label="Currency" hint="Applies to every amount, chart, and summary.">
            <Select
              value={prefs.currency}
              onChange={(e) => setPref('currency', e.target.value)}
              options={CURRENCIES}
            />
          </Field>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Preview</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{money(1234.56)}</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Finance Settings" subtitle="Used for balance and budget calculations" />
        <CardBody className="space-y-5">
          <Field label="Opening balance" hint="Added to your total balance on the dashboard.">
            <Input
              type="number"
              step="0.01"
              value={prefs.openingBalance}
              onChange={(e) => setPref('openingBalance', Number(e.target.value) || 0)}
            />
          </Field>
          <Field label="Monthly budget" hint="Drives budget alerts and the Expenses page progress bar. Set 0 to disable.">
            <Input
              type="number"
              step="1"
              min="0"
              value={prefs.monthlyBudget}
              onChange={(e) => setPref('monthlyBudget', Number(e.target.value) || 0)}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Data Management" subtitle={`${sorted.length} transactions stored in localStorage`} />
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" icon={Download} onClick={exportData}>
              Export JSON
            </Button>
            <Button variant="secondary" icon={DatabaseBackup} onClick={() => setConfirm({ action: 'sample' })}>
              Restore sample data
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => setConfirm({ action: 'clear' })}>
              Clear all data
            </Button>
          </div>
          <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <p>· All data lives in your browser's localStorage — nothing is sent to a server.</p>
            <p>· Clearing data removes every transaction but keeps your preferences.</p>
            <p>· Restoring sample data replaces current transactions with the demo dataset.</p>
          </div>
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => {
              resetPrefs()
              setProfile({ userName: 'Alex Morgan', userEmail: 'alex.morgan@example.com' })
            }}
          >
            Reset preferences to defaults
          </Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.action === 'sample') loadSampleData()
          if (confirm?.action === 'clear') clearAll()
          setConfirm(null)
        }}
        title={confirm?.action === 'clear' ? 'Clear all data' : 'Restore sample data'}
        confirmLabel={confirm?.action === 'clear' ? 'Clear everything' : 'Restore'}
        message={
          confirm?.action === 'clear'
            ? 'This permanently deletes all saved transactions from this browser. Your preferences will be kept.'
            : 'Your current transactions will be replaced with the original demo dataset.'
        }
      />
    </div>
  )
}
