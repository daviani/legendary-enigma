import { Fleet } from '../Models/Fleet.js'

export interface FleetRepository {
  save(fleet: Fleet): void
  findById(fleetId: string): Fleet | null
}
