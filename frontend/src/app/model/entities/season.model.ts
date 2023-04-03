import { Race } from "./race.model";

export class Season {
  constructor(
    public id?: number,
    public name?: string,
    public races?: Race[]
  ) {}
}
