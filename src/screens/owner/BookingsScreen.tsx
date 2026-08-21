import { useEffect, useState } from 'react'
import { ownerService } from '../../services/owners.service'
import type { Booking } from '../../types'
import TopBar from '../../components/ui/TopBar'
import Badge from '../../components/ui/Badge'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
  })
}

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ownerService.getMyBookings().then((data) => {
      setBookings(data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()))
      setLoading(false)
    })
  }, [])

  const active = bookings.filter((b) => b.status === 'active')
  const completed = bookings.filter((b) => b.status !== 'active')

  const payLabel = { gcash: 'GCash', maya: 'Maya', cash: 'Cash' }

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar title="BOOKINGS" subtitle="All incoming bookings" back />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="font-mono text-[10px] text-gray-300 py-12 text-center">Loading...</div>
        ) : (
          <>
            {/* Active */}
            {active.length > 0 && (
              <div className="px-4 pt-5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
                  Active Now ({active.length})
                </div>
                <div className="flex flex-col gap-2">
                  {active.map((b) => (
                    <BookingRow key={b.id} booking={b} payLabel={payLabel} active />
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <div className="px-4 pt-5 pb-6">
                <div className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
                  Completed ({completed.length})
                </div>
                <div className="flex flex-col gap-2">
                  {completed.map((b) => (
                    <BookingRow key={b.id} booking={b} payLabel={payLabel} active={false} />
                  ))}
                </div>
              </div>
            )}

            {bookings.length === 0 && (
              <div className="font-mono text-[10px] text-gray-300 py-12 text-center">
                No bookings yet.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function BookingRow({
  booking,
  payLabel,
  active,
}: {
  booking: Booking
  payLabel: Record<string, string>
  active: boolean
}) {
  return (
    <div className="border border-gray-100 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-mono text-sm font-bold text-ink tracking-widest">
            {booking.plateNumber}
          </div>
          <div className="font-mono text-[9px] text-gray-400 mt-0.5">{booking.spotName}</div>
        </div>
        <Badge color={active ? 'green' : 'gray'}>
          {active ? 'Active' : 'Done'}
        </Badge>
      </div>
      <div className="flex gap-4 mt-1">
        <div>
          <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Ref</div>
          <div className="font-mono text-xs text-ink">{booking.reference}</div>
        </div>
        <div>
          <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Duration</div>
          <div className="font-mono text-xs text-ink">{booking.durationHours}h</div>
        </div>
        <div>
          <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Payment</div>
          <div className="font-mono text-xs text-ink">{payLabel[booking.paymentMethod]}</div>
        </div>
        <div>
          <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest">Earned</div>
          <div className="font-mono text-xs text-ink font-bold">₱{booking.totalAmount}</div>
        </div>
      </div>
    </div>
  )
}
