import { Vehicle } from '../Models/Vehicle.js'

export interface VehicleRepository {
  save(vehicle: Vehicle): void
  findByPlateNumber(plateNumber: string): Vehicle | null
}
