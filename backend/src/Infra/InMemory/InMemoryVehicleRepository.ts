import { VehicleRepository } from '../../Domain/Ports/VehicleRepository.js'
import { Vehicle } from '../../Domain/Models/Vehicle.js'

export class InMemoryVehicleRepository implements VehicleRepository {
  private vehicles: Map<string, Vehicle> = new Map()

  findByPlateNumber(plateNumber: string): Vehicle | null {
    return this.vehicles.get(plateNumber) ?? null
  }

  save(vehicle: Vehicle): void {
    this.vehicles.set(vehicle.plateNumber, vehicle)
  }
}
