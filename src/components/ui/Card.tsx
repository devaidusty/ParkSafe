interface Props {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'white' | 'dark'
}

const variants = {
  default: 'bg-[#ececec] shadow-card',
  white: 'bg-white shadow-card-light border border-gray-100',
  dark: 'bg-ink text-white shadow-card',
}

export default function Card({ children, className = '', variant = 'default' }: Props) {
  return (
    <div className={`p-6 ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}
