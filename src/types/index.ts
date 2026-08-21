export type ZoneType = 'green' | 'yellow' | 'red'
export type VehicleType = 'car' | 'motorcycle' | 'both'
export type PaymentMethod = 'gcash' | 'maya' | 'cash'
export type BookingStatus = 'active' | 'completed' | 'cancelled'

export interface ParkingSpot {
  id: string
  name: string
  address: string
  barangay: string
  lat: number
  lng: number
  type: ZoneType
  ratePerHour: number
  vehicleTypes: VehicleType
  hoursOpen: string
  slotsTotal: number
  slotsAvailable: number
  ownerName: string
}

export interface Booking {
  id: string
  reference: string
  spotId: string
  spotName: string
  spotAddress: string
  plateNumber: string
  vehicleType: 'car' | 'motorcycle'
  durationHours: number
  paymentMethod: PaymentMethod
  totalAmount: number
  startTime: string
  endTime: string
  status: BookingStatus
}

export interface OwnedSpot extends ParkingSpot {
  totalEarnings: number
  totalBookings: number
}
