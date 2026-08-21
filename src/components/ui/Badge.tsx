type Color = 'green' | 'yellow' | 'red' | 'gray' | 'black'

interface Props {
  color?: Color
  children: React.ReactNode
}

const colors: Record<Color, string> = {
  green: 'bg-zone-green text-white',
  yellow: 'bg-zone-yellow text-white',
  red: 'bg-zone-red text-white',
  gray: 'bg-gray-100 text-gray-600',
  black: 'bg-ink text-white',
}

export default function Badge({ color = 'gray', children }: Props) {
  return (
    <span
      className={`inline-block font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 ${colors[color]}`}
    >
      {children}
    </span>
  )
}
