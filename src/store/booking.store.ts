import { create } from 'zustand'
import type { Booking, ParkingSpot, PaymentMethod } from '../types'

interface BookingDraft {
  spot: ParkingSpot | null
  plateNumber: string
  vehicleType: 'car' | 'motorcycle'
  durationHours: number
  paymentMethod: PaymentMethod
}

interface BookingState {
  draft: BookingDraft
  confirmedBooking: Booking | null
  setSpot: (spot: ParkingSpot) => void
  setPlate: (plate: string) => void
  setVehicleType: (type: 'car' | 'motorcycle') => void
  setDuration: (hours: number) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setConfirmed: (booking: Booking) => void
  reset: () => void
}

const initialDraft: BookingDraft = {
  spot: null,
  plateNumber: '',
  vehicleType: 'car',
  durationHours: 2,
  paymentMethod: 'gcash',
}

export const useBookingStore = create<BookingState>((set) => ({
  draft: { ...initialDraft },
  confirmedBooking: null,
  setSpot: (spot) => set((s) => ({ draft: { ...s.draft, spot } })),
  setPlate: (plateNumber) => set((s) => ({ draft: { ...s.draft, plateNumber } })),
  setVehicleType: (vehicleType) => set((s) => ({ draft: { ...s.draft, vehicleType } })),
  setDuration: (durationHours) => set((s) => ({ draft: { ...s.draft, durationHours } })),
  setPaymentMethod: (paymentMethod) => set((s) => ({ draft: { ...s.draft, paymentMethod } })),
  setConfirmed: (confirmedBooking) => set({ confirmedBooking }),
  reset: () => set({ draft: { ...initialDraft }, confirmedBooking: null }),
}))
