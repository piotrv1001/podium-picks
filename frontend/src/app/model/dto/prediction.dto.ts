export class PredictionDTO {
  constructor(
    public predictedPosition: number,
    public driverId: number,
    public raceId: number,
    public userId: number,
    public groupId: number
  ) {}
}
