import { Fleet } from '../../../Domain/Models/Fleet.js'
import { FleetRepository } from '../../../Domain/Ports/FleetRepository.js'
import { CreateFleetCommand } from './CreateFleetCommand.js'

export class CreateFleetCommandHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: CreateFleetCommand): Promise<string> {
    const id = crypto.randomUUID()
    const fleet = new Fleet(id, command.userId)

    await this.fleetRepository.save(fleet)
    return fleet.id
  }
}
