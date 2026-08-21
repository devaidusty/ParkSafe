import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '../../store/booking.store'
import Button from '../../components/ui/Button'

export default function ConfirmedScreen() {
  const navigate = useNavigate()
  const { confirmedBooking, reset } = useBookingStore()
  const [endLabel, setEndLabel] = useState('')

  useEffect(() => {
    if (!confirmedBooking) {
      navigate('/driver/map')
      return
    }
    const end = new Date(confirmedBooking.endTime)
    setEndLabel(
      end.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })
    )
  }, [confirmedBooking, navigate])

  if (!confirmedBooking) return null

  function handleDone() {
    reset()
    navigate('/driver/map')
  }

  return (
    <div className="flex flex-col h-screen bg-white items-center justify-center px-8 text-center gap-5">
      {/* Check circle */}
      <div
        className="w-16 h-16 rounded-full border-2 border-ink flex items-center justify-center"
      >
        <span className="text-2xl font-bold text-ink">✓</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-ink mb-1">You're parked.</h1>
        <p className="font-mono text-[10px] tracking-wide text-gray-400 leading-relaxed">
          Your spot is reserved &amp; legally logged.<br />No clamping risk.
        </p>
      </div>

      {/* Booking reference */}
      <div className="w-full bg-gray-50 border border-gray-200 py-4 px-6">
        <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">
          Booking Reference
        </div>
        <div className="font-mono text-2xl font-bold text-ink tracking-widest">
          {confirmedBooking.reference}
        </div>
      </div>

      {/* Details */}
      <div className="w-full flex flex-col gap-2 text-left">
        {[
          { label: 'Spot', value: confirmedBooking.spotName },
          { label: 'Plate', value: confirmedBooking.plateNumber },
          { label: 'Session ends', value: endLabel },
          { label: 'Payment', value: confirmedBooking.paymentMethod.toUpperCase() },
          { label: 'Total paid', value: `₱${confirmedBooking.totalAmount}.00` },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">{label}</span>
            <span className="font-medium text-xs text-ink">{value}</span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[9px] text-gray-400 leading-relaxed">
        You'll be notified 15 min before your session ends.
      </p>

      <div className="w-full flex flex-col gap-2 mt-2">
        <Button fullWidth size="lg">
          Navigate to Spot
        </Button>
        <Button fullWidth size="md" variant="outline" onClick={handleDone}>
          Back to Map
        </Button>
      </div>
    </div>
  )
}
