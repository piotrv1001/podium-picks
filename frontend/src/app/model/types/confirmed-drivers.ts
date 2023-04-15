import { Driver } from "../entities/driver.model"

export type ConfirmedDrivers = {
  drivers: Driver[];
  confirmed: boolean;
}
