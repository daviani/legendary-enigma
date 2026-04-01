import { Given, When, Then, Before } from '@cucumber/cucumber'
import assert from 'node:assert'
import { Fleet } from '../src/Domain/Models/Fleet.js'
import { Vehicle } from '../src/Domain/Models/Vehicle.js'
import { InMemoryFleetRepository } from '../src/Infra/InMemory/InMemoryFleetRepository.js'
import { InMemoryVehicleRepository } from '../src/Infra/InMemory/InMemoryVehicleRepository.js'
import { RegisterVehicleCommand } from '../src/App/Commands/RegisterVehicle/RegisterVehicleCommand.js'
import { RegisterVehicleCommandHandler } from '../src/App/Commands/RegisterVehicle/RegisterVehicleCommandHandler.js'

// Reset state before each scenario
Before(function () {
  this.fleetRepository = new InMemoryFleetRepository()
  this.vehicleRepository = new InMemoryVehicleRepository()
  this.error = null
})

Given('my fleet', function () {
  this.myFleet = new Fleet('fleet-1', 'user-1')
  this.fleetRepository.save(this.myFleet)
})

Given('a vehicle', function () {
  this.vehicle = new Vehicle('ABC-123')
})

Given('the fleet of another user', function () {
  this.otherFleet = new Fleet('fleet-2', 'user-2')
  this.fleetRepository.save(this.otherFleet)
})

Given('I have registered this vehicle into my fleet', function () {
  const command = new RegisterVehicleCommand(
    this.myFleet.id,
    this.vehicle.plateNumber,
  )
  const handler = new RegisterVehicleCommandHandler(
    this.fleetRepository,
    this.vehicleRepository,
  )
  handler.handle(command)
})

Given(
  "this vehicle has been registered into the other user's fleet",
  function () {
    const command = new RegisterVehicleCommand(
      this.otherFleet.id,
      this.vehicle.plateNumber,
    )
    const handler = new RegisterVehicleCommandHandler(
      this.fleetRepository,
      this.vehicleRepository,
    )
    handler.handle(command)
  },
)

When('I register this vehicle into my fleet', function () {
  const command = new RegisterVehicleCommand(
    this.myFleet.id,
    this.vehicle.plateNumber,
  )
  const handler = new RegisterVehicleCommandHandler(
    this.fleetRepository,
    this.vehicleRepository,
  )
  handler.handle(command)
})

When('I try to register this vehicle into my fleet', function () {
  const command = new RegisterVehicleCommand(
    this.myFleet.id,
    this.vehicle.plateNumber,
  )
  const handler = new RegisterVehicleCommandHandler(
    this.fleetRepository,
    this.vehicleRepository,
  )
  try {
    handler.handle(command)
  } catch (e) {
    this.error = e
  }
})

Then('this vehicle should be part of my vehicle fleet', function () {
  const fleet = this.fleetRepository.findById(this.myFleet.id)
  assert.strictEqual(fleet.hasVehicle(this.vehicle), true)
})

Then(
  'I should be informed this this vehicle has already been registered into my fleet',
  function () {
    assert.notStrictEqual(this.error, null)
  },
)
