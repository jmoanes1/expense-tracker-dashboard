export function Card({ className = '', children, ...rest }) {
  return (
    <section className={`card ${className}`} {...rest}>
      {children}
    </section>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6 ${className}`}>
      <div>
        <h2 className="card-title">{title}</h2>
        {subtitle ? <p className="card-subtitle mt-0.5">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  )
}

export function CardBody({ className = '', children }) {
  return <div className={`px-5 py-5 sm:px-6 ${className}`}>{children}</div>
}
