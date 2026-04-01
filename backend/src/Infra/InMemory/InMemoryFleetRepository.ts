import { Fleet } from '../../Domain/Models/Fleet.js'
import { FleetRepository } from '../../Domain/Ports/FleetRepository.js'

export class InMemoryFleetRepository implements FleetRepository {
  private fleets: Map<string, Fleet> = new Map()

  findById(fleetId: string): Fleet | null {
    return this.fleets.get(fleetId) ?? null
  }

  save(fleet: Fleet): void {
    this.fleets.set(fleet.id, fleet)
  }
}
