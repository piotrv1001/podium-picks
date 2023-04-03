import { Prediction } from "./prediction.model";
import { Result } from "./result.model";
import { Team } from "./team.model";

export class Driver {
  constructor(
    public id?: number,
    public name?: string,
    public team?: Team,
    public teamId?: number,
    public predictions?: Prediction[],
    public results?: Result[]
  ) {}
}
