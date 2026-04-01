import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

async function initDatabase(): Promise<void> {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS fleets (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL
      )
    `)

  await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        plate_number VARCHAR PRIMARY KEY,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        altitude DOUBLE PRECISION
      )
    `)

  await pool.query(`
      CREATE TABLE IF NOT EXISTS fleet_vehicles (
        fleet_id VARCHAR REFERENCES fleets(id),
        plate_number VARCHAR REFERENCES vehicles(plate_number),
        PRIMARY KEY (fleet_id, plate_number)
      )
    `)
}

async function closeDatabase(): Promise<void> {
  await pool.end()
}

export { pool, initDatabase, closeDatabase }
