import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import type { ParkingSpot, ZoneType } from '../../types'
import { spotService } from '../../services/spots.service'
import { useBookingStore } from '../../store/booking.store'
import { LUCENA_CENTER } from '../../data/mock-spots'
import Badge from '../../components/ui/Badge'

const ZONE_COLORS: Record<ZoneType, string> = {
  green: '#1d5c38',
  yellow: '#b8860b',
  red: '#8b1a1a',
}

function createPinIcon(type: ZoneType, selected = false) {
  const color = ZONE_COLORS[type]
  const size = selected ? 28 : 22
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${color};
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      border:2px solid rgba(255,255,255,0.4);
      transition:all 0.15s;
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  })
}

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: onMapClick })
  return null
}

export default function MapScreen() {
  const navigate = useNavigate()
  const setSpot = useBookingStore((s) => s.setSpot)
  const [spots, setSpots] = useState<ParkingSpot[]>([])
  const [selected, setSelected] = useState<ParkingSpot | null>(null)
  const [loading, setLoading] = useState(true)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    spotService.getNearby(LUCENA_CENTER.lat, LUCENA_CENTER.lng).then((data) => {
      setSpots(data)
      setLoading(false)
    })
  }, [])

  const greenSpots = spots.filter((s) => s.type === 'green' && s.slotsAvailable > 0)

  function handlePinClick(spot: ParkingSpot) {
    setSelected(spot)
  }

  function handleBook() {
    if (!selected) return
    setSpot(selected)
    navigate('/driver/spot')
  }

  const zoneLabel: Record<ZoneType, string> = {
    green: 'Legal Zone',
    yellow: 'Time Restricted',
    red: 'No Parking',
  }

  const badgeColor: Record<ZoneType, 'green' | 'yellow' | 'red'> = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* TopBar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0 z-10 bg-white">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink font-medium">
            PARKSAFE
          </div>
          <div className="font-mono text-[9px] text-gray-400 tracking-wide">Lucena City</div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="font-mono text-[9px] uppercase tracking-widest text-gray-400"
        >
          Switch role
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
            <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Loading map...
            </div>
          </div>
        )}
        <MapContainer
          center={[LUCENA_CENTER.lat, LUCENA_CENTER.lng]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler onMapClick={() => setSelected(null)} />
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={createPinIcon(spot.type, selected?.id === spot.id)}
              eventHandlers={{ click: () => handlePinClick(spot) }}
            />
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-3 right-3 bg-white px-3 py-2 flex flex-col gap-1.5 z-[400]"
          style={{ boxShadow: 'rgba(0,0,0,0.1) 0 2px 8px' }}>
          {(['green', 'yellow', 'red'] as ZoneType[]).map((t) => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[t] }} />
              <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500">
                {zoneLabel[t]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar — spot count */}
      {!selected && (
        <div className="shrink-0 px-4 py-4 border-t border-gray-100 bg-white z-10">
          <div className="font-semibold text-sm text-ink mb-0.5">
            {loading ? '—' : `${greenSpots.length} spots available nearby`}
          </div>
          <div className="font-mono text-[9px] text-gray-400 tracking-wide">
            Quezon Ave area · updated now
          </div>
        </div>
      )}

      {/* Bottom sheet — selected spot */}
      {selected && (
        <div
          ref={sheetRef}
          className="shrink-0 border-t border-gray-100 bg-white z-10 px-4 pt-4 pb-6"
          style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.1)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-sm text-ink leading-tight">{selected.name}</div>
              <div className="font-mono text-[9px] text-gray-400 tracking-wide mt-0.5">
                {selected.barangay}
              </div>
            </div>
            <Badge color={badgeColor[selected.type]}>{zoneLabel[selected.type]}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest mb-0.5">Rate</div>
              <div className="font-semibold text-sm text-ink">
                {selected.type === 'green' ? `₱${selected.ratePerHour}/hr` : 'See rules'}
              </div>
            </div>
            <div>
              <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest mb-0.5">Slots</div>
              <div className="font-semibold text-sm text-ink">
                {selected.type === 'green'
                  ? selected.slotsAvailable > 0
                    ? `${selected.slotsAvailable} open`
                    : 'Full'
                  : '—'}
              </div>
            </div>
            <div>
              <div className="font-mono text-[8px] uppercase text-gray-400 tracking-widest mb-0.5">Vehicles</div>
              <div className="font-semibold text-sm text-ink capitalize">{selected.vehicleTypes}</div>
            </div>
          </div>

          <div className="flex gap-2">
            {selected.type === 'green' && selected.slotsAvailable > 0 && (
              <button
                onClick={handleBook}
                className="flex-1 bg-ink text-white font-mono text-[10px] tracking-widest uppercase py-3 text-center"
              >
                Book This Spot
              </button>
            )}
            {selected.type !== 'green' && (
              <div className="flex-1 bg-gray-100 font-mono text-[10px] tracking-widest uppercase py-3 text-center text-gray-400">
                {selected.type === 'red' ? 'No Parking Zone' : 'Time Restrictions Apply'}
              </div>
            )}
            {selected.type === 'green' && selected.slotsAvailable === 0 && (
              <div className="flex-1 bg-gray-100 font-mono text-[10px] tracking-widest uppercase py-3 text-center text-gray-400">
                Lot Full
              </div>
            )}
            <button
              onClick={() => setSelected(null)}
              className="border border-gray-200 font-mono text-[9px] uppercase tracking-widest py-3 px-4 text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
