import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = '', ...rest }: Props) {
  return (
    <div className="w-full">
      {label && (
        <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
          {label}
        </div>
      )}
      <input
        className={`w-full border-b border-gray-200 py-2 text-sm font-medium text-ink placeholder-gray-300 bg-transparent outline-none focus:border-ink transition-colors ${className}`}
        {...rest}
      />
    </div>
  )
}
