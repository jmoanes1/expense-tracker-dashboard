import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { KEYS, readJSON, writeJSON } from '../lib/storage'
import { uid } from '../lib/format'

const AuthContext = createContext(null)

const DEFAULT_USERS = [
  {
    id: 'user_alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
]

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = readJSON(KEYS.users, null)
    if (Array.isArray(stored) && stored.length > 0) {
      return stored
    }
    writeJSON(KEYS.users, DEFAULT_USERS)
    return DEFAULT_USERS
  })

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = readJSON(KEYS.currentUser, null)
    if (saved && saved.id) {
      return saved
    }
    // Default to the demo user logged in or null (let's check default user)
    const initialUser = {
      id: DEFAULT_USERS[0].id,
      name: DEFAULT_USERS[0].name,
      email: DEFAULT_USERS[0].email,
    }
    writeJSON(KEYS.currentUser, initialUser)
    return initialUser
  })

  useEffect(() => {
    writeJSON(KEYS.users, users)
  }, [users])

  useEffect(() => {
    if (currentUser) {
      writeJSON(KEYS.currentUser, currentUser)
    } else {
      window.localStorage.removeItem(KEYS.currentUser)
    }
  }, [currentUser])

  const register = useCallback((name, email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()

    if (!trimmedName) throw new Error('Please enter your full name')
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address')
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (existing) {
      throw new Error('An account with this email already exists')
    }

    const newUser = {
      id: `user_${uid()}`,
      name: trimmedName,
      email: trimmedEmail,
      password,
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }
    setCurrentUser(sessionUser)
    return sessionUser
  }, [users])

  const login = useCallback((email, password) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) throw new Error('Please enter your email')
    if (!password) throw new Error('Please enter your password')

    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    if (user.password !== password) {
      throw new Error('Invalid email or password')
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    }
    setCurrentUser(sessionUser)
    return sessionUser
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const updateProfile = useCallback((name, email) => {
    if (!currentUser) return
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName) throw new Error('Name cannot be empty')
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address')
    }

    // Check if email taken by someone else
    const emailConflict = users.find((u) => u.id !== currentUser.id && u.email.toLowerCase() === trimmedEmail)
    if (emailConflict) {
      throw new Error('Email is already in use by another account')
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, name: trimmedName, email: trimmedEmail } : u))
    )
    setCurrentUser((prev) => ({
      ...prev,
      name: trimmedName,
      email: trimmedEmail,
    }))
  }, [currentUser, users])

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      register,
      logout,
      updateProfile,
    }),
    [currentUser, login, register, logout, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
