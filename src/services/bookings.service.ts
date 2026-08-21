import type { Booking, PaymentMethod } from '../types'
import { mockBookings } from '../data/mock-bookings'

export interface CreateBookingPayload {
  spotId: string
  spotName: string
  spotAddress: string
  plateNumber: string
  vehicleType: 'car' | 'motorcycle'
  durationHours: number
  paymentMethod: PaymentMethod
  ratePerHour: number
}

export interface BookingService {
  create(payload: CreateBookingPayload): Promise<Booking>
  getAll(): Promise<Booking[]>
}

const bookings: Booking[] = [...mockBookings]

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

function generateRef(): string {
  return 'PS-' + String(Math.floor(1000 + Math.random() * 9000))
}

class MockBookingService implements BookingService {
  async create(payload: CreateBookingPayload): Promise<Booking> {
    await delay()
    const now = new Date()
    const end = new Date(now.getTime() + payload.durationHours * 3600000)
    const booking: Booking = {
      id: 'bk-' + Date.now(),
      reference: generateRef(),
      spotId: payload.spotId,
      spotName: payload.spotName,
      spotAddress: payload.spotAddress,
      plateNumber: payload.plateNumber.toUpperCase(),
      vehicleType: payload.vehicleType,
      durationHours: payload.durationHours,
      paymentMethod: payload.paymentMethod,
      totalAmount: payload.durationHours * payload.ratePerHour,
      startTime: now.toISOString(),
      endTime: end.toISOString(),
      status: 'active',
    }
    bookings.push(booking)
    return booking
  }

  async getAll(): Promise<Booking[]> {
    await delay(200)
    return [...bookings]
  }
}

export const bookingService: BookingService = new MockBookingService()
