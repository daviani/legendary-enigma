import { FleetRepository } from '../../../Domain/Ports/FleetRepository.js'
import { VehicleRepository } from '../../../Domain/Ports/VehicleRepository.js'
import { ParkVehicleCommand } from './ParkVehicleCommand.js'
import { Location } from '../../../Domain/Models/Location.js'
import { Fleet } from '../../../Domain/Models/Fleet.js'
import { Vehicle } from '../../../Domain/Models/Vehicle.js'

export class ParkVehicleCommandHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  handle(command: ParkVehicleCommand): void {
    const fleet: Fleet | null = this.fleetRepository.findById(command.fleetId)
    const location = new Location(
      command.latitude,
      command.longitude,
      command.altitude,
    )
    let vehicle: Vehicle | null = this.vehicleRepository.findByPlateNumber(
      command.vehiclePlateNumber,
    )

    if (!vehicle)
      throw new Error(
        `Unknown vehicle PlateNumber: ${command.vehiclePlateNumber}`,
      )

    if (!fleet) throw new Error(`Unknown fleet ID: ${command.fleetId}`)

    if (!fleet.hasVehicle(vehicle))
      throw new Error(
        `Vehicle is not registered in this fleet: ${vehicle.plateNumber}`,
      )

    vehicle.park(location)
    this.vehicleRepository.save(vehicle)
  }
}
