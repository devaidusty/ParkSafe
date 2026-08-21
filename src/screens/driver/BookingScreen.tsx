import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '../../store/booking.store'
import TopBar from '../../components/ui/TopBar'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const DURATIONS = [1, 2, 3, 4]

export default function BookingScreen() {
  const navigate = useNavigate()
  const { draft, setPlate, setVehicleType, setDuration } = useBookingStore()
  const { spot, plateNumber, vehicleType, durationHours } = draft

  if (!spot) {
    navigate('/driver/map')
    return null
  }

  const total = durationHours * spot.ratePerHour
  const canContinue = plateNumber.trim().length >= 6

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar title="Book Spot" back />

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        {/* Spot summary */}
        <div className="border-b border-gray-100 pb-4">
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">
            Selected spot
          </div>
          <div className="font-semibold text-sm text-ink">{spot.name}</div>
          <div className="font-mono text-[9px] text-gray-400 mt-0.5">{spot.address} · {spot.barangay}</div>
        </div>

        {/* Duration */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
            Duration
          </div>
          <div className="flex gap-2">
            {DURATIONS.map((h) => (
              <button
                key={h}
                onClick={() => setDuration(h)}
                className={`flex-1 py-3 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                  durationHours === h
                    ? 'bg-ink text-white'
                    : 'border border-gray-200 text-gray-500'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Plate number */}
        <Input
          label="Plate Number"
          placeholder="e.g. ABC 1234"
          value={plateNumber}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          maxLength={10}
        />

        {/* Vehicle type */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
            Vehicle Type
          </div>
          <div className="flex gap-2">
            {(['car', 'motorcycle'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setVehicleType(t)}
                disabled={spot.vehicleTypes !== 'both' && spot.vehicleTypes !== t}
                className={`flex-1 py-3 font-mono text-[10px] tracking-widest uppercase transition-colors disabled:opacity-30 ${
                  vehicleType === t
                    ? 'bg-ink text-white'
                    : 'border border-gray-200 text-gray-500'
                }`}
              >
                {t === 'car' ? 'Car' : 'Moto'}
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">
                Total
              </div>
              <div className="font-mono text-[9px] text-gray-400">
                {durationHours}h × ₱{spot.ratePerHour}/hr
              </div>
            </div>
            <div className="text-2xl font-bold text-ink">₱{total}.00</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 px-6 pb-8 pt-4 border-t border-gray-100">
        <Button
          fullWidth
          size="lg"
          disabled={!canContinue}
          onClick={() => navigate('/driver/payment')}
        >
          Continue to Payment
        </Button>
        {!canContinue && (
          <p className="font-mono text-[9px] text-gray-400 text-center mt-2">
            Enter your plate number to continue
          </p>
        )}
      </div>
    </div>
  )
}
