import { Vehicle } from './Vehicle.js'

export class Fleet {
  private readonly vehicles: Vehicle[] = []

  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}

  addVehicle(vehicle: Vehicle): void {
    if (this.hasVehicle(vehicle)) {
      throw new Error('Vehicle already exists')
    }
    this.vehicles.push(vehicle)
  }

  hasVehicle(vehicle: Vehicle): boolean {
    return this.vehicles.some((v) => v.plateNumber === vehicle.plateNumber)
  }
}
