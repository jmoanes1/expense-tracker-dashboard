import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useEffect } from 'react'

const TONES = {
  success: {
    icon: CheckCircle2,
    className: 'border-green-200 bg-green-50 text-green-800 dark:border-green-500/25 dark:bg-green-500/15 dark:text-green-200',
  },
  danger: {
    icon: AlertTriangle,
    className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/25 dark:bg-red-500/15 dark:text-red-200',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/25 dark:bg-blue-500/15 dark:text-blue-200',
  },
}

export function Toast({ event, onDismiss }) {
  useEffect(() => {
    if (!event) return undefined
    const timer = setTimeout(onDismiss, 3200)
    return () => clearTimeout(timer)
  }, [event, onDismiss])

  if (!event) return null
  const tone = TONES[event.tone] ?? TONES.success
  const Icon = tone.icon

  return (
    <div
      role="status"
      className={`fixed inset-x-4 bottom-4 z-[60] flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-sm ${tone.className}`}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      <span className="flex-1">{event.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 hover:bg-black/5"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
