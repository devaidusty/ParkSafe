import { create } from 'zustand'
import type { Booking, OwnedSpot } from '../types'

interface OwnerState {
  spots: OwnedSpot[]
  bookings: Booking[]
  loading: boolean
  setSpots: (spots: OwnedSpot[]) => void
  setBookings: (bookings: Booking[]) => void
  addSpot: (spot: OwnedSpot) => void
  setLoading: (loading: boolean) => void
}

export const useOwnerStore = create<OwnerState>((set) => ({
  spots: [],
  bookings: [],
  loading: false,
  setSpots: (spots) => set({ spots }),
  setBookings: (bookings) => set({ bookings }),
  addSpot: (spot) => set((s) => ({ spots: [...s.spots, spot] })),
  setLoading: (loading) => set({ loading }),
}))
