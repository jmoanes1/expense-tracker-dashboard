export function Segmented({ options, value, onChange, 'aria-label': ariaLabel }) {
  return (
    <div className="segmented" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`segmented-btn ${value === opt.value ? 'segmented-btn-active' : ''}`}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
