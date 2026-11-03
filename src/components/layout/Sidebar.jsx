import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { NAV_ITEMS } from '../../lib/navigation'
import { IconButton } from '../ui/Button'

export function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M3 17.5 9 11l4 3.5L21 6.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M15 6.5h6v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="text-base font-bold leading-tight text-slate-900 dark:text-slate-50">FinTrack</p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Expense Tracker</p>
          </div>
        </div>
        {onNavigate ? (
          <IconButton label="Close menu" icon={X} className="lg:hidden" onClick={onNavigate} />
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Main navigation">
        <p className="px-3.5 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Tip</p>
        <p className="mt-1 text-sm leading-snug text-blue-50">
          Keep your categories tidy — reports and charts group spending automatically.
        </p>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-900">
      <SidebarContent />
    </aside>
  )
}
