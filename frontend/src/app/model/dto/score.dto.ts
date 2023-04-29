export class ScoreDTO {
  constructor(
    public points: number,
    public position: number,
    public userId: number,
    public raceId: number,
    public groupId: number
  ) {}
}
