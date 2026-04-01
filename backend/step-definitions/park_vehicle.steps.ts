import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'node:assert'
import { Location } from '../src/Domain/Models/Location.js'
import { ParkVehicleCommand } from '../src/App/Commands/ParkVehicle/ParkVehicleCommand.js'
import { ParkVehicleCommandHandler } from '../src/App/Commands/ParkVehicle/ParkVehicleCommandHandler.js'

Given('a location', function () {
  this.location = new Location(48.8566, 2.3522)
})

Given('my vehicle has been parked into this location', async function () {
  const command = new ParkVehicleCommand(
    this.myFleet.id,
    this.vehicle.plateNumber,
    this.location.latitude,
    this.location.longitude,
  )
  const handler = new ParkVehicleCommandHandler(
    this.fleetRepository,
    this.vehicleRepository,
  )
  await handler.handle(command)
})

When('I try to park my vehicle at this location', async function () {
  const command = new ParkVehicleCommand(
    this.myFleet.id,
    this.vehicle.plateNumber,
    this.location.latitude,
    this.location.longitude,
  )
  const handler = new ParkVehicleCommandHandler(
    this.fleetRepository,
    this.vehicleRepository,
  )
  try {
    await handler.handle(command)
  } catch (e) {
    this.error = e
  }
})

When('I park my vehicle at this location', async function () {
  const command = new ParkVehicleCommand(
    this.myFleet.id,
    this.vehicle.plateNumber,
    this.location.latitude,
    this.location.longitude,
  )
  const handler = new ParkVehicleCommandHandler(
    this.fleetRepository,
    this.vehicleRepository,
  )
  await handler.handle(command)
})

Then(
  'the known location of my vehicle should verify this location',
  function () {
    const vehicle = this.vehicleRepository.findByPlateNumber(
      this.vehicle.plateNumber,
    )
    assert.ok(vehicle.location)
    assert.strictEqual(vehicle.location.equals(this.location), true)
  },
)

Then(
  'I should be informed that my vehicle is already parked at this location',
  function () {
    assert.notStrictEqual(this.error, null)
  },
)
