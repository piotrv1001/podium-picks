import { Team } from "./team.model";

export class Driver {
  constructor(
    public id?: number,
    public name?: string,
    public team?: Team
  ) {}
}
