import { Location } from './Location.js'

export class Vehicle {
  constructor(public readonly plateNumber: string) {}

  public location: Location | null = null

  park(location: Location): void {
    if (this.location && this.location.equals(location)) {
      throw new Error('Vehicle is already parked at this location')
    }
    this.location = location
  }
}
