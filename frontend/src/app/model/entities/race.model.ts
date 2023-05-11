import { Driver } from "./driver.model";
import { Prediction } from "./prediction.model";
import { Result } from "./result.model";
import { Score } from "./score.model";
import { Season } from "./season.model";

export class Race {
  constructor(
    public id?: number,
    public name?: string,
    public date?: Date,
    public predictionDeadline?: Date,
    public country?: string,
    public countryCode?: string,
    public predictions?: Prediction[],
    public results?: Result[],
    public scores?: Score[],
    public season?: Season,
    public seasonId?: number,
    public fastestLapDriver?: Driver,
    public fastestLapDriverId?: number,
    public dnfDrivers?: Driver[]
  ) {}
}
