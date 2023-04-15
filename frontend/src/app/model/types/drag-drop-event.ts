import { Driver } from "../entities/driver.model";

export type DragDropEvent = {
  previousIndex: number;
  currentIndex: number;
  drivers: Driver[];
}
