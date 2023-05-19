import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Request,
  Query,
  Put,
} from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { Prediction } from './prediction.entity';
import { ResultService } from 'src/result/result.service';
import { ScoreService } from 'src/score/score.service';
import { Score } from 'src/score/score.entity';

type PredictionOutput =
  | Prediction[]
  | { predictions: Prediction[]; scores: Score[] };

@Controller('predictions')
export class PredictionController {
  constructor(
    private readonly predictionService: PredictionService,
    private readonly resultService: ResultService,
    private readonly scoreService: ScoreService,
  ) {}

  @Post('createMany')
  async createMany(@Request() req): Promise<PredictionOutput> {
    const predictionDtoArray = req.body;
    const predictions = await this.predictionService.createMany(
      predictionDtoArray,
    );
    const raceId = predictionDtoArray?.[0]?.raceId;
    if (raceId != null) {
      const results = await this.resultService.getByRaceId(raceId);
      if (results.length > 0) {
        const groupId = predictionDtoArray?.[0]?.groupId;
        if (groupId != null) {
          const scores = await this.scoreService.calculateScoresForRaceForGroup(
            raceId,
            groupId,
            results,
          );
          return { predictions, scores };
        }
      }
    }
    return predictions;
  }

  @Post()
  create(@Request() req): Promise<Prediction> {
    return this.predictionService.create(req.body);
  }

  @Put('updateMany')
  async updateMany(@Request() req): Promise<PredictionOutput> {
    const predictionDtoArray = req.body;
    const predictions = await this.predictionService.updateMany(
      predictionDtoArray,
    );
    const raceId = predictionDtoArray?.[0]?.raceId;
    if (raceId != null) {
      const results = await this.resultService.getByRaceId(raceId);
      if (results.length > 0) {
        const groupId = predictionDtoArray?.[0]?.groupId;
        if (groupId != null) {
          const scores = await this.scoreService.calculateScoresForRaceForGroup(
            raceId,
            groupId,
            results,
          );
          return { predictions, scores };
        }
      }
    }
    return predictions;
  }

  @Get(':groupId/races/:raceId/predictions')
  async getGroupedPredictions(
    @Param('groupId') groupId: number,
    @Param('raceId') raceId: number,
  ) {
    const groupedPredictions =
      await this.predictionService.getPredictionsByGroupAndRace(
        groupId,
        raceId,
      );

    const response = {};
    groupedPredictions.forEach((predictions, userId) => {
      response[userId] = predictions;
    });

    return response;
  }

  @Get()
  getByUserAndRace(
    @Query('userId') userId: number,
    @Query('raceId') raceId: number,
    @Query('groupId') groupId: number,
  ) {
    return this.predictionService.getByUserAndRaceAndGroup(
      userId,
      raceId,
      groupId,
    );
  }

  @Get()
  getAll(): Promise<Prediction[]> {
    return this.predictionService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Prediction> {
    return this.predictionService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.predictionService.delete(id);
  }
}
