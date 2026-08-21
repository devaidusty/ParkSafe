import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { enforcerService } from '../../services/enforcer.service'
import type { PlateCheckResult } from '../../services/enforcer.service'
import Button from '../../components/ui/Button'

export default function PlateCheckScreen() {
  const navigate = useNavigate()
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlateCheckResult | null>(null)

  async function handleCheck() {
    if (plate.trim().length < 5) return
    setLoading(true)
    setResult(null)
    try {
      const res = await enforcerService.checkPlate(plate)
      setResult(res)
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    setPlate('')
    setResult(null)
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
              ParkSafe
            </div>
            <div className="font-mono text-[13px] tracking-widest text-ink font-bold">
              ENFORCER PORTAL
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="font-mono text-[9px] uppercase tracking-widest text-gray-400"
          >
            Switch role
          </button>
        </div>
        <p className="font-mono text-[10px] text-gray-400 leading-relaxed">
          Enter a vehicle plate number to check if it is legally booked in ParkSafe.
        </p>
      </div>

      <div className="flex-1 flex flex-col px-6 py-8 gap-6">
        {/* Plate input */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
            Plate Number
          </div>
          <input
            value={plate}
            onChange={(e) => {
              setPlate(e.target.value.toUpperCase())
              if (result) setResult(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="e.g. ABC 1234"
            maxLength={12}
            className="w-full text-3xl font-mono font-bold text-ink border-b-2 border-ink py-3 bg-transparent outline-none placeholder-gray-200 tracking-widest uppercase"
          />
          <div className="font-mono text-[9px] text-gray-300 mt-2">
            Try: ABC 1234, XYZ 5678, DEF 7890, LMN 9999
          </div>
        </div>

        {/* Check button */}
        <Button
          fullWidth
          size="lg"
          loading={loading}
          disabled={plate.trim().length < 5}
          onClick={handleCheck}
        >
          Check Plate
        </Button>

        {/* Result */}
        {result && (
          <div
            className={`p-6 flex flex-col gap-3 ${
              result.found ? 'bg-zone-green' : 'bg-zone-red'
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-white opacity-70">
              {result.found ? 'Status — Legally Parked' : 'Status — Not Found'}
            </div>
            <div className="text-white text-2xl font-bold tracking-widest">
              {plate}
            </div>

            {result.found && result.booking ? (
              <div className="flex flex-col gap-2 mt-1">
                {[
                  { label: 'Reference', value: result.booking.reference },
                  { label: 'Location', value: result.booking.spotName },
                  { label: 'Time remaining', value: `${result.minutesRemaining} min` },
                  { label: 'Payment', value: result.booking.paymentMethod.toUpperCase() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between border-t border-white border-opacity-20 pt-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white opacity-60">
                      {label}
                    </span>
                    <span className="font-mono text-xs text-white font-bold">{value}</span>
                  </div>
                ))}
                <div className="mt-3 font-mono text-[9px] tracking-widest uppercase text-white opacity-80 text-center">
                  Move on — vehicle is legally parked
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <p className="font-mono text-[10px] text-white leading-relaxed opacity-80">
                  This plate is not registered in ParkSafe. Proceed with standard enforcement protocol.
                </p>
                <div className="mt-4 border border-white border-opacity-30 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-white">
                  Issue Citation if Applicable
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <button
            onClick={handleClear}
            className="font-mono text-[9px] uppercase tracking-widest text-gray-400 text-center"
          >
            Check another plate
          </button>
        )}
      </div>
    </div>
  )
}
