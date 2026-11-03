export function Field({ label, hint, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ className = '', ...rest }) {
  return <input className={`field ${className}`} {...rest} />
}

export function Select({ options = [], className = '', children, ...rest }) {
  return (
    <select className={`field appearance-none bg-[length:1rem] ${className}`} {...rest}>
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ),
      )}
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...rest }) {
  return <textarea className={`field resize-none ${className}`} rows={3} {...rest} />
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? 'left-[1.375rem]' : 'left-0.5'
        }`}
      />
    </button>
  )
}
