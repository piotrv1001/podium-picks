import { Driver } from "./driver.model";
import { Race } from "./race.model";

export class Result {
  constructor(
    public id?: number,
    public position?: number,
    public race?: Race,
    public driver?: Driver,
    public raceId?: number,
    public driverId?: number
  ) {}
}
