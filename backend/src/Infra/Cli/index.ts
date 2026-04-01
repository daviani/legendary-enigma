import { InMemoryFleetRepository } from '../InMemory/InMemoryFleetRepository.js'
import { CreateFleetCommand } from '../../App/Commands/CreateFleet/CreateFleetCommand.js'
import { CreateFleetCommandHandler } from '../../App/Commands/CreateFleet/CreateFleetCommandHandler.js'
import { InMemoryVehicleRepository } from '../InMemory/InMemoryVehicleRepository.js'
import { ParkVehicleCommand } from '../../App/Commands/ParkVehicle/ParkVehicleCommand.js'
import { ParkVehicleCommandHandler } from '../../App/Commands/ParkVehicle/ParkVehicleCommandHandler.js'
import { RegisterVehicleCommand } from '../../App/Commands/RegisterVehicle/RegisterVehicleCommand.js'
import { RegisterVehicleCommandHandler } from '../../App/Commands/RegisterVehicle/RegisterVehicleCommandHandler.js'
import { initDatabase, pool } from '../Postgres/database.js'
import { PostgresFleetRepository } from '../Postgres/PostgresFleetRepository.js'
import { PostgresVehicleRepository } from '../Postgres/PostgresVehicleRepository.js'

// Skip first two argv entries (node binary + script path)
const [, , command, ...args] = process.argv

const usePostgres = !!process.env.DATABASE_URL

if (usePostgres) {
  await initDatabase()
}

switch (command) {
  // ./fleet create <userId> → returns fleetId
  case 'create': {
    const userId: string | undefined = args[0]
    if (!userId) {
      console.error('No userId provided')
      process.exit(1)
    }

    const fleetRepo = usePostgres
      ? new PostgresFleetRepository(pool)
      : new InMemoryFleetRepository()

    const cmd = new CreateFleetCommand(userId)
    const handler = new CreateFleetCommandHandler(fleetRepo)

    const fleetId = await handler.handle(cmd)
    console.log(fleetId)
    break
  }
  // ./fleet register-vehicle <fleetId> <vehiclePlateNumber>
  case 'register-vehicle': {
    const fleetId: string | undefined = args[0]
    if (!fleetId) {
      console.error('No fleetId provided')
      process.exit(1)
    }

    const vehiclePlateNumber: string | undefined = args[1]
    if (!vehiclePlateNumber) {
      console.error('No vehiclePlateNumber provided')
      process.exit(1)
    }

    const fleetRepo = usePostgres
      ? new PostgresFleetRepository(pool)
      : new InMemoryFleetRepository()

    const vehicleRepo = usePostgres
      ? new PostgresVehicleRepository(pool)
      : new InMemoryVehicleRepository()

    const cmd = new RegisterVehicleCommand(fleetId, vehiclePlateNumber)
    const handler = new RegisterVehicleCommandHandler(fleetRepo, vehicleRepo)

    await handler.handle(cmd)
    break
  }
  // ./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]
  case 'localize-vehicle': {
    const fleetId: string | undefined = args[0]
    if (!fleetId) {
      console.error('No fleetId provided')
      process.exit(1)
    }

    const vehiclePlateNumber: string | undefined = args[1]
    if (!vehiclePlateNumber) {
      console.error('No vehiclePlateNumber provided')
      process.exit(1)
    }

    const lat: string | undefined = args[2]
    if (!lat) {
      console.error('No latitude provided')
      process.exit(1)
    }

    const lng: string | undefined = args[3]
    if (!lng) {
      console.error('No longitude provided')
      process.exit(1)
    }

    const alt: string | undefined = args[4]

    const latitude: number = parseFloat(lat)
    if (isNaN(latitude)) {
      console.error('Invalid latitude')
      process.exit(1)
    }
    const longitude: number = parseFloat(lng)
    if (isNaN(longitude)) {
      console.error('Invalid longitude')
      process.exit(1)
    }
    const altitude: number | undefined = alt ? parseFloat(alt) : undefined

    const fleetRepo = usePostgres
      ? new PostgresFleetRepository(pool)
      : new InMemoryFleetRepository()

    const vehicleRepo = usePostgres
      ? new PostgresVehicleRepository(pool)
      : new InMemoryVehicleRepository()

    const cmd = new ParkVehicleCommand(
      fleetId,
      vehiclePlateNumber,
      latitude,
      longitude,
      altitude,
    )
    const handler = new ParkVehicleCommandHandler(fleetRepo, vehicleRepo)

    await handler.handle(cmd)
    break
  }
  default:
    console.error(
      'Usage: fleet <create|register-vehicle|localize-vehicle> [args]',
    )
    process.exit(1)
}

if (usePostgres) await pool.end()
