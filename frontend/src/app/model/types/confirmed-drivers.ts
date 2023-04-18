import { Driver } from "../entities/driver.model"
import { Score } from "../entities/score.model";

export type ConfirmedDrivers = {
  drivers: Driver[];
  confirmed: boolean;
}
