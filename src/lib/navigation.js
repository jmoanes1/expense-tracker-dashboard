import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  Settings,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard', hint: 'Financial overview' },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight, title: 'Transactions', hint: 'All income and expenses' },
  { to: '/expenses', label: 'Expenses', icon: TrendingDown, title: 'Expenses', hint: 'Where your money goes' },
  { to: '/income', label: 'Income', icon: TrendingUp, title: 'Income', hint: 'Everything you earned' },
  { to: '/reports', label: 'Reports', icon: BarChart3, title: 'Reports', hint: 'Monthly and yearly summaries' },
  { to: '/settings', label: 'Settings', icon: Settings, title: 'Settings', hint: 'Preferences and data' },
]

export function navForPath(pathname) {
  return NAV_ITEMS.find((item) => (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to))) ?? NAV_ITEMS[0]
}
