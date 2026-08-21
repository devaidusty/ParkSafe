import type { Booking } from '../types'

const now = new Date()
const fmt = (d: Date) => d.toISOString()
const addHours = (h: number) => new Date(now.getTime() + h * 3600000)
const subHours = (h: number) => new Date(now.getTime() - h * 3600000)

export const mockBookings: Booking[] = [
  {
    id: 'bk-001',
    reference: 'PS-2841',
    spotId: 'spot-001',
    spotName: 'Quezon Ave Private Lot A',
    spotAddress: '145 Quezon Ave, Brgy. Ibabang Dupay',
    plateNumber: 'ABC 1234',
    vehicleType: 'car',
    durationHours: 2,
    paymentMethod: 'gcash',
    totalAmount: 60,
    startTime: fmt(subHours(1)),
    endTime: fmt(addHours(1)),
    status: 'active',
  },
  {
    id: 'bk-002',
    reference: 'PS-3317',
    spotId: 'spot-002',
    spotName: 'St. Ferdinand Cathedral Compound',
    spotAddress: 'Quezon Ave cor. Enriquez St',
    plateNumber: 'XYZ 5678',
    vehicleType: 'motorcycle',
    durationHours: 1,
    paymentMethod: 'maya',
    totalAmount: 25,
    startTime: fmt(subHours(0.5)),
    endTime: fmt(addHours(0.5)),
    status: 'active',
  },
  {
    id: 'bk-003',
    reference: 'PS-4102',
    spotId: 'spot-003',
    spotName: 'Merchan St Commercial Parking',
    spotAddress: '89 Merchan St, Brgy. Poblacion',
    plateNumber: 'LMN 9999',
    vehicleType: 'car',
    durationHours: 3,
    paymentMethod: 'cash',
    totalAmount: 60,
    startTime: fmt(subHours(2)),
    endTime: fmt(addHours(1)),
    status: 'active',
  },
  {
    id: 'bk-004',
    reference: 'PS-1087',
    spotId: 'spot-005',
    spotName: 'Enriquez St Private Lot',
    spotAddress: '67 Enriquez St, Brgy. Ibabang Dupay',
    plateNumber: 'QRS 4455',
    vehicleType: 'car',
    durationHours: 2,
    paymentMethod: 'gcash',
    totalAmount: 60,
    startTime: fmt(subHours(5)),
    endTime: fmt(subHours(3)),
    status: 'completed',
  },
  {
    id: 'bk-005',
    reference: 'PS-0772',
    spotId: 'spot-006',
    spotName: 'Market Road Lot',
    spotAddress: '12 Market Rd, Brgy. Ibabang Palale',
    plateNumber: 'TUV 2200',
    vehicleType: 'motorcycle',
    durationHours: 1,
    paymentMethod: 'maya',
    totalAmount: 20,
    startTime: fmt(subHours(3)),
    endTime: fmt(subHours(2)),
    status: 'completed',
  },
  {
    id: 'bk-006',
    reference: 'PS-5521',
    spotId: 'spot-001',
    spotName: 'Quezon Ave Private Lot A',
    spotAddress: '145 Quezon Ave, Brgy. Ibabang Dupay',
    plateNumber: 'DEF 7890',
    vehicleType: 'car',
    durationHours: 4,
    paymentMethod: 'gcash',
    totalAmount: 120,
    startTime: fmt(subHours(0.25)),
    endTime: fmt(addHours(3.75)),
    status: 'active',
  },
]

export function getActiveBookingByPlate(plate: string): Booking | undefined {
  const normalized = plate.toUpperCase().replace(/\s/g, ' ').trim()
  return mockBookings.find(
    (b) =>
      b.status === 'active' &&
      b.plateNumber.toUpperCase().replace(/\s/g, ' ').trim() === normalized
  )
}
