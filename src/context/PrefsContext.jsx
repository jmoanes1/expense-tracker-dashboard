import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { formatMoney } from '../lib/format'
import { KEYS, readJSON, writeJSON } from '../lib/storage'

const DEFAULT_PREFS = {
  theme: 'light',
  currency: 'USD',
  openingBalance: 3500,
  monthlyBudget: 3800,
  userName: 'Alex Morgan',
  userEmail: 'alex.morgan@example.com',
  readAt: '',
}

const PrefsContext = createContext(null)

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(() => ({
    ...DEFAULT_PREFS,
    ...readJSON(KEYS.prefs, {}),
  }))

  useEffect(() => {
    writeJSON(KEYS.prefs, prefs)
  }, [prefs])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', prefs.theme === 'dark')
    document.documentElement.style.colorScheme = prefs.theme
  }, [prefs.theme])

  const setPref = useCallback((key, value) => {
    setPrefs((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }))
  }, [])

  const value = useMemo(
    () => ({
      prefs,
      setPref,
      resetPrefs: () => setPrefs(DEFAULT_PREFS),
      isDark: prefs.theme === 'dark',
      toggleTheme: () => setPref('theme', prefs.theme === 'dark' ? 'light' : 'dark'),
    }),
    [prefs, setPref],
  )

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider')
  return ctx
}

/** Convenience hook for money formatting with the saved currency. */
export function useCurrencyFormatter() {
  const { prefs } = usePrefs()
  return useCallback((value, opts) => formatMoney(value, prefs.currency, opts), [prefs.currency])
}
