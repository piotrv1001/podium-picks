import { Driver } from "./driver.model";

export class Team {
  constructor(
    public id?: number,
    public name?: string,
    public color?: string,
    public drivers?: Driver[]
  ) {}
}
