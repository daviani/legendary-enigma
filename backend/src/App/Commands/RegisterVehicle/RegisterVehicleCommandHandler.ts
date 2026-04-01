import { FleetRepository } from '../../../Domain/Ports/FleetRepository.js'
import { VehicleRepository } from '../../../Domain/Ports/VehicleRepository.js'
import { RegisterVehicleCommand } from './RegisterVehicleCommand.js'
import { Fleet } from '../../../Domain/Models/Fleet.js'
import { Vehicle } from '../../../Domain/Models/Vehicle.js'

export class RegisterVehicleCommandHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async handle(command: RegisterVehicleCommand): Promise<void> {
    const fleet: Fleet | null = await this.fleetRepository.findById(
      command.fleetId,
    )

    if (!fleet) throw new Error(`Unknown fleet ID: ${command.fleetId}`)

    let vehicle = await this.vehicleRepository.findByPlateNumber(
      command.vehiclePlateNumber,
    )
    if (!vehicle) vehicle = new Vehicle(command.vehiclePlateNumber)
    fleet.addVehicle(vehicle)
    await this.vehicleRepository.save(vehicle)
    await this.fleetRepository.save(fleet)
  }
}
