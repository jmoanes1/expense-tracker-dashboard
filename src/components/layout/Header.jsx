import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, LogOut, Menu, Moon, Settings, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCurrencyFormatter, usePrefs } from '../../context/PrefsContext'
import { useTransactions } from '../../context/TransactionsContext'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatLongDate, today } from '../../lib/format'
import { navForPath } from '../../lib/navigation'
import { buildNotifications, unreadCount } from '../../lib/notifications'
import { IconButton } from '../ui/Button'

function useClickOutside(onOutside) {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOutside])
  return ref
}

const TONE_STYLES = {
  danger: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300',
  success: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
}

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { prefs, setPref } = usePrefs()
  const { transactions } = useTransactions()
  const ref = useClickOutside(() => setOpen(false))

  const notifications = buildNotifications(transactions, prefs)
  const unread = unreadCount(notifications, prefs.readAt)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unread > 0 ? (
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Notifications</p>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              onClick={() => setPref('readAt', today())}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">You're all caught up.</p>
            ) : (
              notifications.map((n) => {
                const isUnread = !prefs.readAt || n.date > prefs.readAt
                return (
                  <div key={n.id} className="flex gap-3 px-4 py-3">
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${TONE_STYLES[n.tone]}`}>
                      <Bell className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {n.title}
                        {isUnread ? <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden /> : null}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                      <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {formatDate(n.date, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const { prefs, isDark, toggleTheme } = usePrefs()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const ref = useClickOutside(() => setOpen(false))

  const displayName = currentUser?.name || prefs.userName
  const displayEmail = currentUser?.email || prefs.userEmail

  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {initials || 'U'}
        </span>
        <span className="hidden text-left md:block">
          <span className="block text-sm font-semibold leading-tight text-slate-900 dark:text-slate-100">
            {displayName}
          </span>
          <span className="block text-[11px] leading-tight text-slate-400 dark:text-slate-500">Personal account</span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" aria-hidden />
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{displayEmail}</p>
          </div>
          <div className="p-1.5">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => {
                setOpen(false)
                navigate('/settings')
              }}
            >
              <Settings className="h-4 w-4" aria-hidden />
              Settings
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function Header({ onOpenSidebar }) {
  const { pathname } = useLocation()
  const { isDark, toggleTheme } = usePrefs()
  const nav = navForPath(pathname)

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <IconButton
          label="Open navigation menu"
          icon={Menu}
          className="lg:hidden"
          onClick={onOpenSidebar}
        />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-xl">
            {nav.title}
          </h1>
          <p className="hidden truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:block">
            {nav.hint} · {formatLongDate()}
          </p>
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400 sm:hidden">
            {formatLongDate(new Date(), { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <IconButton
          label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          icon={isDark ? Sun : Moon}
          onClick={toggleTheme}
        />
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  )
}
