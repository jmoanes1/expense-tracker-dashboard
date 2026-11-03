import { forwardRef } from 'react'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, className = '', children, ...rest },
  ref,
) {
  const sizing = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'icon' ? 'p-2.5' : ''
  return (
    <button
      ref={ref}
      type="button"
      className={`${VARIANTS[variant] ?? VARIANTS.primary} ${sizing} ${className}`}
      {...rest}
    >
      {Icon ? <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden /> : null}
      {children}
      {IconRight ? <IconRight className="h-4 w-4" aria-hidden /> : null}
    </button>
  )
})

export function IconButton({ label, icon, variant = 'ghost', className = '', ...rest }) {
  return (
    <Button variant={variant} size="icon" icon={icon} aria-label={label} title={label} className={className} {...rest} />
  )
}
