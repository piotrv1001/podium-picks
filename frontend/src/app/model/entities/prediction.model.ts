import { Driver } from "./driver.model";
import { Race } from "./race.model";
import { User } from "./user.model";

export class Prediction {
  constructor(
    public id?: number,
    public predictedPosition?: number,
    public driver?: Driver,
    public user?: User,
    public race?: Race,
    public driverId?: number,
    public userId?: number,
    public raceId?: number
  ) {}
}
