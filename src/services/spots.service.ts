import type { ParkingSpot } from '../types'
import { mockSpots } from '../data/mock-spots'

export interface SpotService {
  getNearby(lat: number, lng: number): Promise<ParkingSpot[]>
  getById(id: string): Promise<ParkingSpot | undefined>
}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

class MockSpotService implements SpotService {
  async getNearby(_lat: number, _lng: number): Promise<ParkingSpot[]> {
    await delay()
    return mockSpots
  }

  async getById(id: string): Promise<ParkingSpot | undefined> {
    await delay(150)
    return mockSpots.find((s) => s.id === id)
  }
}

export const spotService: SpotService = new MockSpotService()
