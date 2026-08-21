import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PaymentMethod } from '../../types'
import { useBookingStore } from '../../store/booking.store'
import { bookingService } from '../../services/bookings.service'
import TopBar from '../../components/ui/TopBar'
import Button from '../../components/ui/Button'

const METHODS: { id: PaymentMethod; label: string; sub: string }[] = [
  { id: 'gcash', label: 'GCash', sub: 'Instant digital payment' },
  { id: 'maya', label: 'Maya', sub: 'Pay via Maya wallet' },
  { id: 'cash', label: 'Cash', sub: 'Pay on arrival to owner' },
]

export default function PaymentScreen() {
  const navigate = useNavigate()
  const { draft, setPaymentMethod, setConfirmed } = useBookingStore()
  const { spot, plateNumber, vehicleType, durationHours, paymentMethod } = draft
  const [loading, setLoading] = useState(false)

  if (!spot) {
    navigate('/driver/map')
    return null
  }

  const total = durationHours * spot.ratePerHour

  async function handlePay() {
    if (!spot) return
    setLoading(true)
    try {
      const booking = await bookingService.create({
        spotId: spot.id,
        spotName: spot.name,
        spotAddress: `${spot.address}, ${spot.barangay}`,
        plateNumber,
        vehicleType,
        durationHours,
        paymentMethod,
        ratePerHour: spot.ratePerHour,
      })
      setConfirmed(booking)
      navigate('/driver/confirmed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar title="Payment" back />

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        {/* Booking summary */}
        <div className="bg-gray-50 p-4 flex flex-col gap-3">
          {[
            { label: 'Location', value: spot.name },
            { label: 'Plate', value: plateNumber },
            { label: 'Duration', value: `${durationHours} hour${durationHours > 1 ? 's' : ''}` },
            { label: 'Vehicle', value: vehicleType === 'car' ? 'Car' : 'Motorcycle' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">{label}</span>
              <span className="font-medium text-xs text-ink">{value}</span>
            </div>
          ))}
        </div>

        {/* Payment method */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
            Payment Method
          </div>
          <div className="flex flex-col gap-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`w-full text-left p-4 flex items-center justify-between transition-colors ${
                  paymentMethod === m.id
                    ? 'bg-ink text-white'
                    : 'border border-gray-200 text-ink'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm">{m.label}</div>
                  <div
                    className={`font-mono text-[9px] tracking-wide mt-0.5 ${
                      paymentMethod === m.id ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  >
                    {m.sub}
                  </div>
                </div>
                {paymentMethod === m.id && (
                  <span className="font-mono text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Total + CTA */}
      <div className="shrink-0 px-6 pb-8 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
              Total to Pay
            </div>
            <div className="font-mono text-[9px] text-gray-400">
              via {METHODS.find((m) => m.id === paymentMethod)?.label}
            </div>
          </div>
          <div className="text-3xl font-bold text-ink">₱{total}.00</div>
        </div>
        <Button fullWidth size="lg" loading={loading} onClick={handlePay}>
          Confirm &amp; Pay
        </Button>
      </div>
    </div>
  )
}
