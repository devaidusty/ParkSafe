import { useNavigate } from 'react-router-dom'

interface Props {
  title?: string
  subtitle?: string
  back?: boolean
  right?: React.ReactNode
}

export default function TopBar({ title, subtitle, back = false, right }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="font-mono text-[9px] tracking-widest uppercase text-gray-400 hover:text-ink transition-colors"
          >
            ← Back
          </button>
        )}
        {!back && title && (
          <div>
            <div className="font-mono text-[11px] tracking-widest uppercase text-ink font-medium">
              {title}
            </div>
            {subtitle && (
              <div className="font-mono text-[9px] text-gray-400 tracking-wide mt-0.5">{subtitle}</div>
            )}
          </div>
        )}
        {back && title && (
          <div>
            <div className="font-semibold text-sm text-ink">{title}</div>
            {subtitle && (
              <div className="font-mono text-[9px] text-gray-400 tracking-wide">{subtitle}</div>
            )}
          </div>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
