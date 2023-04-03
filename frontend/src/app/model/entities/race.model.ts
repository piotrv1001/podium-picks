import { Prediction } from "./prediction.model";
import { Result } from "./result.model";
import { Score } from "./score.model";
import { Season } from "./season.model";

export class Race {
  constructor(
    public id?: number,
    public name?: string,
    public date?: Date,
    public country?: string,
    public predictions?: Prediction[],
    public results?: Result[],
    public scores?: Score[],
    public season?: Season,
    public seasonId?: number
  ) {}
}
