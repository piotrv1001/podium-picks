import {
  Controller,
  Get,
  Delete,
  Param,
  Request,
  Post,
  Query,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { Score } from './score.entity';

@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  create(@Request() req): Promise<Score> {
    return this.scoreService.create(req.body);
  }

  @Post('/calculate')
  calculate(
    @Query('raceId') raceId: number,
    @Query('groupId') groupId: number,
  ): Promise<Score[]> {
    return this.scoreService.calculateScoresForRaceForGroup(raceId, groupId);
  }

  @Get('/races/:raceId/groups/:groupId')
  async getByRaceAndGroup(
    @Param('raceId') raceId: number,
    @Param('groupId') groupId: number,
  ) {
    const grouppedScores = await this.scoreService.getScoresByGroupAndRace(
      groupId,
      raceId,
    );

    const response = {};
    grouppedScores.forEach((predictions, userId) => {
      response[userId] = predictions;
    });

    return response;
  }

  @Get()
  getAll(): Promise<Score[]> {
    return this.scoreService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Score> {
    return this.scoreService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.scoreService.delete(id);
  }
}
