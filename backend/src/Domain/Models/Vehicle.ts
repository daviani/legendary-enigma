import { Location } from './Location.js'

export class Vehicle {
  constructor(public readonly plateNumber: string) {}

  private _location: Location | null = null

  park(location: Location): void {
    if (this._location && this._location.equals(location)) {
      throw new Error('Vehicle is already parked at this location')
    }

    this._location = location
  }

  get location(): Location | null {
    return this._location
  }
}
