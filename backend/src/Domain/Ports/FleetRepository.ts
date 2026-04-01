import { Fleet } from '../Models/Fleet.js'

export interface FleetRepository {
  save(fleet: Fleet): void | Promise<void>
  findById(fleetId: string): Fleet | null | Promise<Fleet | null>
}
