import type { Booking } from '../types'
import { mockBookings } from '../data/mock-bookings'

export interface PlateCheckResult {
  found: boolean
  booking?: Booking
  minutesRemaining?: number
}

export interface EnforcerService {
  checkPlate(plate: string): Promise<PlateCheckResult>
}

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

const allBookings: Booking[] = [...mockBookings]

class MockEnforcerService implements EnforcerService {
  async checkPlate(plate: string): Promise<PlateCheckResult> {
    await delay()
    const normalized = plate.toUpperCase().replace(/\s+/g, ' ').trim()
    const booking = allBookings.find(
      (b) =>
        b.status === 'active' &&
        b.plateNumber.toUpperCase().replace(/\s+/g, ' ').trim() === normalized
    )
    if (!booking) return { found: false }
    const end = new Date(booking.endTime).getTime()
    const minutesRemaining = Math.max(0, Math.round((end - Date.now()) / 60000))
    return { found: true, booking, minutesRemaining }
  }
}

export const enforcerService: EnforcerService = new MockEnforcerService()
