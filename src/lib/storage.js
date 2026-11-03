const PREFIX = 'etd'

export const KEYS = {
  transactions: `${PREFIX}.transactions.v1`,
  prefs: `${PREFIX}.prefs.v1`,
}

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
