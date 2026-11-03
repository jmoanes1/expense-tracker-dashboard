import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTransactions } from '../../context/TransactionsContext'
import { Toast } from '../ui/Toast'
import { Header } from './Header'
import { Sidebar, SidebarContent } from './Sidebar'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { lastEvent, dismissEvent } = useTransactions()

  useEffect(() => {
    setSidebarOpen(false)
    window.scrollTo({ top: 0 })
  }, [pathname])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
        <footer className="mx-auto w-full max-w-7xl px-4 pb-8 text-center text-xs text-slate-400 dark:text-slate-600 sm:px-6 lg:px-8">
          FinTrack · Data is stored locally in your browser
        </footer>
      </div>

      <Toast event={lastEvent} onDismiss={dismissEvent} />
    </div>
  )
}
