import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerService } from '../../services/owners.service'
import { useOwnerStore } from '../../store/owner.store'
import TopBar from '../../components/ui/TopBar'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { VehicleType } from '../../types'

const BARANGAYS = [
  'Brgy. Ibabang Dupay',
  'Brgy. Poblacion',
  'Brgy. Talao-Talao',
  'Brgy. Cotta',
  'Brgy. Ibabang Palale',
  'Brgy. Gulang-Gulang',
  'Brgy. Ilayang Dupay',
  'Brgy. Ransohan',
]

export default function ListSpotScreen() {
  const navigate = useNavigate()
  const addSpot = useOwnerStore((s) => s.addSpot)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [barangay, setBarangay] = useState(BARANGAYS[0])
  const [rate, setRate] = useState('30')
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType>('both')
  const [slots, setSlots] = useState('10')
  const [openFrom, setOpenFrom] = useState('6:00 AM')
  const [openTo, setOpenTo] = useState('10:00 PM')

  const canSubmit = name.trim().length > 2 && address.trim().length > 2 && Number(rate) > 0

  async function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    try {
      const spot = await ownerService.listSpot({
        name: name.trim(),
        address: address.trim(),
        barangay,
        lat: 13.9381 + (Math.random() - 0.5) * 0.01,
        lng: 121.6166 + (Math.random() - 0.5) * 0.01,
        type: 'green',
        ratePerHour: Number(rate),
        vehicleTypes,
        hoursOpen: `${openFrom} – ${openTo}`,
        slotsTotal: Number(slots),
        slotsAvailable: Number(slots),
        ownerName: 'You',
        totalEarnings: 0,
        totalBookings: 0,
      })
      addSpot(spot)
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col h-screen bg-white items-center justify-center px-8 text-center gap-5">
        <div className="w-16 h-16 rounded-full border-2 border-ink flex items-center justify-center">
          <span className="text-2xl font-bold text-ink">✓</span>
        </div>
        <h1 className="text-xl font-semibold text-ink">Space Listed!</h1>
        <p className="font-mono text-[10px] text-gray-400 tracking-wide leading-relaxed">
          Your space is now visible to drivers<br />in Lucena City.
        </p>
        <Button fullWidth size="lg" onClick={() => navigate('/owner')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar title="List a Space" back />

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        <Input
          label="Space Name"
          placeholder="e.g. Quezon Ave Private Lot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Street Address"
          placeholder="e.g. 145 Quezon Ave"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Barangay */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
            Barangay
          </div>
          <select
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            className="w-full border-b border-gray-200 py-2 text-sm font-medium text-ink bg-transparent outline-none"
          >
            {BARANGAYS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Rate */}
        <Input
          label="Rate (₱ per hour)"
          type="number"
          placeholder="30"
          value={rate}
          min="1"
          onChange={(e) => setRate(e.target.value)}
        />

        {/* Slots */}
        <Input
          label="Number of Slots"
          type="number"
          placeholder="10"
          value={slots}
          min="1"
          onChange={(e) => setSlots(e.target.value)}
        />

        {/* Vehicle types */}
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
            Vehicle Types Accepted
          </div>
          <div className="flex gap-2">
            {([['both', 'Car & Moto'], ['car', 'Car Only'], ['motorcycle', 'Moto Only']] as [VehicleType, string][]).map(
              ([val, label]) => (
                <button
                  key={val}
                  onClick={() => setVehicleTypes(val)}
                  className={`flex-1 py-2.5 font-mono text-[9px] tracking-widest uppercase transition-colors ${
                    vehicleTypes === val
                      ? 'bg-ink text-white'
                      : 'border border-gray-200 text-gray-500'
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Hours */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
              Opens at
            </div>
            <select
              value={openFrom}
              onChange={(e) => setOpenFrom(e.target.value)}
              className="w-full border-b border-gray-200 py-2 text-sm font-medium text-ink bg-transparent outline-none"
            >
              {['5:00 AM','6:00 AM','7:00 AM','8:00 AM'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
              Closes at
            </div>
            <select
              value={openTo}
              onChange={(e) => setOpenTo(e.target.value)}
              className="w-full border-b border-gray-200 py-2 text-sm font-medium text-ink bg-transparent outline-none"
            >
              {['6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="font-mono text-[9px] text-gray-400 leading-relaxed">
          Listing is free. ParkSafe collects a small commission per booking only when you earn.
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 px-6 pb-8 pt-4 border-t border-gray-100">
        <Button fullWidth size="lg" loading={loading} disabled={!canSubmit} onClick={handleSubmit}>
          List This Space
        </Button>
      </div>
    </div>
  )
}
