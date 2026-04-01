import { Vehicle } from '../Models/Vehicle.js'

export interface VehicleRepository {
  save(vehicle: Vehicle): void | Promise<void>
  findByPlateNumber(
    plateNumber: string,
  ): Vehicle | null | Promise<Vehicle | null>
}
