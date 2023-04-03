import { Group } from "./group.model";
import { Prediction } from "./prediction.model";
import { Score } from "./score.model";

export class User {
  constructor(
    public id?: number,
    public username?: string,
    public password?: string,
    public predictions?: Prediction[],
    public scores?: Score[],
    public group?: Group,
    public groupId?: number
  ) {}
}
