import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PrefsProvider } from './context/PrefsContext'
import { TransactionsProvider } from './context/TransactionsContext'
import { DashboardPage } from './pages/DashboardPage'
import { ExpensesPage } from './pages/ExpensesPage'
import { IncomePage } from './pages/IncomePage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TransactionsPage } from './pages/TransactionsPage'

export function App() {
  return (
    <PrefsProvider>
      <TransactionsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="income" element={<IncomePage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TransactionsProvider>
    </PrefsProvider>
  )
}
