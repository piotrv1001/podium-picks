import { User } from "./user.model";

export class Group {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public users?: User[]
  ) {}
}
