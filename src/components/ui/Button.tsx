import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}: Props) {
  const base =
    'font-mono text-xs tracking-widest uppercase transition-opacity disabled:opacity-40 rounded flex items-center justify-center gap-2 select-none'

  const variants = {
    primary: 'bg-ink text-white',
    outline: 'border border-ink text-ink bg-transparent',
    ghost: 'border border-gray-200 text-gray-500 bg-transparent',
  }

  const sizes = {
    sm: 'px-4 py-2 text-[9px]',
    md: 'px-6 py-3 text-[10px]',
    lg: 'px-6 py-4 text-[11px]',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
