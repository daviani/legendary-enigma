import pg from 'pg'
import { Fleet } from '../../Domain/Models/Fleet.js'
import { Vehicle } from '../../Domain/Models/Vehicle.js'
import { Location } from '../../Domain/Models/Location.js'
import { FleetRepository } from '../../Domain/Ports/FleetRepository.js'

export class PostgresFleetRepository implements FleetRepository {
  constructor(private readonly pool: pg.Pool) {}

  async save(fleet: Fleet): Promise<void> {
    await this.pool.query(
      `INSERT INTO fleets (id, user_id) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET user_id = $2`,
      [fleet.id, fleet.userId],
    )

    for (const vehicle of fleet.getVehicles()) {
      await this.pool.query(
        `INSERT INTO fleet_vehicles (fleet_id, plate_number) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
        [fleet.id, vehicle.plateNumber],
      )
    }
  }

  async findById(fleetId: string): Promise<Fleet | null> {
    const fleetResult = await this.pool.query(
      'SELECT id, user_id FROM fleets WHERE id = $1',
      [fleetId],
    )

    if (fleetResult.rows.length === 0) return null

    const row = fleetResult.rows[0]
    const fleet = new Fleet(row.id, row.user_id)

    const vehiclesResult = await this.pool.query(
      `SELECT v.plate_number, v.latitude, v.longitude, v.altitude
         FROM vehicles v
         JOIN fleet_vehicles fv ON fv.plate_number = v.plate_number
         WHERE fv.fleet_id = $1`,
      [fleetId],
    )

    for (const vRow of vehiclesResult.rows) {
      const vehicle = new Vehicle(vRow.plate_number)
      if (vRow.latitude !== null && vRow.longitude !== null) {
        vehicle.park(new Location(vRow.latitude, vRow.longitude, vRow.altitude))
      }
      fleet.addVehicle(vehicle)
    }

    return fleet
  }
}
