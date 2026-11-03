export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      {Icon ? (
        <span className="mb-1 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
      ) : null}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {message ? <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
