import { Driver } from "../entities/driver.model";
import { Prediction } from "../entities/prediction.model";
import { Score } from "../entities/score.model";
import { User } from "../entities/user.model";
import { ConfirmedDrivers } from "./confirmed-drivers";

export interface UserData {
  predictions?: Prediction[],
  confirmedDrivers?: ConfirmedDrivers,
  scores?: Score[],
  total?: number,
  user?: User
  fastestLapDriver?: Driver;
  dnfDriver?: Driver;
  fastestLapPoints?: number;
  dnfPoints?: number;
}
