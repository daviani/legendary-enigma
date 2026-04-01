import pg from 'pg'
import { Vehicle } from '../../Domain/Models/Vehicle.js'
import { Location } from '../../Domain/Models/Location.js'
import { VehicleRepository } from '../../Domain/Ports/VehicleRepository.js'

export class PostgresVehicleRepository implements VehicleRepository {
  constructor(private readonly pool: pg.Pool) {}

  async save(vehicle: Vehicle): Promise<void> {
    const loc = vehicle.location
    await this.pool.query(
      `INSERT INTO vehicles (plate_number, latitude, longitude, altitude) VALUES ($1, $2, $3, $4)
         ON CONFLICT (plate_number) DO UPDATE SET latitude = $2, longitude = $3, altitude = $4`,
      [
        vehicle.plateNumber,
        loc?.latitude ?? null,
        loc?.longitude ?? null,
        loc?.altitude ?? null,
      ],
    )
  }

  async findByPlateNumber(plateNumber: string): Promise<Vehicle | null> {
    const result = await this.pool.query(
      'SELECT plate_number, latitude, longitude, altitude FROM vehicles WHERE plate_number = $1',
      [plateNumber],
    )

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    const vehicle = new Vehicle(row.plate_number)
    if (row.latitude !== null && row.longitude !== null) {
      vehicle.park(new Location(row.latitude, row.longitude, row.altitude))
    }

    return vehicle
  }
}
