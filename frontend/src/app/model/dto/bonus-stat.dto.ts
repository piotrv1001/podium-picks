export class BonusStatDTO {
  constructor(
    public bonusStatDictId: number,
    public raceId: number,
    public groupId: number,
    public userId: number,
    public driverId?: number
  ) {}
}
