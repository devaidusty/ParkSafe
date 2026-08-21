import type { Booking, OwnedSpot } from '../types'
import { mockSpots } from '../data/mock-spots'
import { mockBookings } from '../data/mock-bookings'

export interface OwnerService {
  getMySpots(): Promise<OwnedSpot[]>
  getMyBookings(): Promise<Booking[]>
  listSpot(data: Omit<OwnedSpot, 'id' | 'totalEarnings' | 'totalBookings'>): Promise<OwnedSpot>
}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// Pre-seed: owner owns first 3 spots
const OWNER_SPOT_IDS = ['spot-001', 'spot-002', 'spot-003']

const ownedSpots: OwnedSpot[] = mockSpots
  .filter((s) => OWNER_SPOT_IDS.includes(s.id))
  .map((s) => {
    const spotBookings = mockBookings.filter((b) => b.spotId === s.id)
    return {
      ...s,
      totalEarnings: spotBookings.reduce((sum, b) => sum + b.totalAmount, 0),
      totalBookings: spotBookings.length,
    }
  })

class MockOwnerService implements OwnerService {
  async getMySpots(): Promise<OwnedSpot[]> {
    await delay()
    return [...ownedSpots]
  }

  async getMyBookings(): Promise<Booking[]> {
    await delay()
    return mockBookings.filter((b) => OWNER_SPOT_IDS.includes(b.spotId))
  }

  async listSpot(data: Omit<OwnedSpot, 'id' | 'totalEarnings' | 'totalBookings'>): Promise<OwnedSpot> {
    await delay(600)
    const spot: OwnedSpot = {
      ...data,
      id: 'spot-' + Date.now(),
      totalEarnings: 0,
      totalBookings: 0,
    }
    ownedSpots.push(spot)
    return spot
  }
}

export const ownerService: OwnerService = new MockOwnerService()
