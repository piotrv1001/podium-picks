import { Race } from "./race.model";
import { User } from "./user.model";

export class Score {
  constructor(
    public id?: number,
    public points?: number,
    public position?: number,
    public user?: User,
    public race?: Race,
    public userId?: number,
    public raceId?: number
  ) {}
}
