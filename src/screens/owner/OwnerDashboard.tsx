import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerService } from '../../services/owners.service'
import { useOwnerStore } from '../../store/owner.store'
import type { OwnedSpot } from '../../types'
import TopBar from '../../components/ui/TopBar'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const { spots, setSpots, setLoading, loading } = useOwnerStore()
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)

  useEffect(() => {
    setLoading(true)
    ownerService.getMySpots().then((data) => {
      setSpots(data)
      setTotalEarnings(data.reduce((s, sp) => s + sp.totalEarnings, 0))
      setTotalBookings(data.reduce((s, sp) => s + sp.totalBookings, 0))
      setLoading(false)
    })
  }, [setSpots, setLoading])

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar
        title="MY SPACES"
        subtitle="Space Owner Portal"
        right={
          <button
            onClick={() => navigate('/')}
            className="font-mono text-[9px] uppercase tracking-widest text-gray-400"
          >
            Switch role
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Earnings card */}
        <div className="bg-ink text-white p-6 flex gap-8">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
              Total Earnings
            </div>
            <div className="text-3xl font-bold">₱{totalEarnings}</div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
              Bookings
            </div>
            <div className="text-3xl font-bold">{totalBookings}</div>
          </div>
        </div>

        {/* Spots list */}
        <div className="px-4 pt-5 pb-2">
          <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
            Your Spaces
          </div>
          {loading ? (
            <div className="font-mono text-[10px] text-gray-300 py-8 text-center">Loading...</div>
          ) : (
            <div className="flex flex-col gap-3">
              {spots.map((spot: OwnedSpot) => (
                <div key={spot.id} className="border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm text-ink">{spot.name}</div>
                      <div className="font-mono text-[9px] text-gray-400 mt-0.5">{spot.barangay}</div>
                    </div>
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1"
                      style={{ background: spot.type === 'green' ? '#1d5c38' : '#b8860b' }}
                    />
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Earned</div>
                      <div className="font-semibold text-sm text-ink">₱{spot.totalEarnings}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Bookings</div>
                      <div className="font-semibold text-sm text-ink">{spot.totalBookings}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Rate</div>
                      <div className="font-semibold text-sm text-ink">₱{spot.ratePerHour}/hr</div>
                    </div>
                    <div>
                      <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Slots</div>
                      <div className="font-semibold text-sm text-ink">
                        {spot.slotsAvailable}/{spot.slotsTotal}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
          <button
            onClick={() => navigate('/owner/bookings')}
            className="w-full border border-gray-200 font-mono text-[10px] uppercase tracking-widest py-3 text-center text-gray-500"
          >
            View All Bookings
          </button>
        </div>
      </div>

      {/* FAB — List new spot */}
      <div className="shrink-0 px-4 pb-8 pt-4 border-t border-gray-100">
        <button
          onClick={() => navigate('/owner/list')}
          className="w-full bg-ink text-white font-mono text-[10px] uppercase tracking-widest py-4 text-center"
        >
          + List a New Space
        </button>
      </div>
    </div>
  )
}
