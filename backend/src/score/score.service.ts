import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { Repository } from 'typeorm';
import { ScoreDTO } from './score.dto';
import { Result } from 'src/result/result.entity';
import { PredictionService } from 'src/prediction/prediction.service';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly predictionService: PredictionService,
  ) {}

  async create(scoreDto: ScoreDTO): Promise<Score> {
    const score = new Score();
    score.points = scoreDto.points;
    score.position = scoreDto.position;
    score.userId = scoreDto.userId;
    score.raceId = scoreDto.raceId;
    return this.scoreRepository.save(score);
  }

  async getAll(): Promise<Score[]> {
    return this.scoreRepository.find();
  }

  async getById(id: number): Promise<Score> {
    return this.scoreRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.scoreRepository.delete(id);
  }

  async calculateScoresForRaceForGroup(
    raceId: number,
    groupId: number,
  ): Promise<Score[]> {
    const scores: Score[] = [];
    const results = await this.resultRepository.find({
      where: {
        raceId: raceId,
      },
      order: {
        position: 'ASC',
      },
    });
    const grouppedPredictions =
      await this.predictionService.getPredictionsByGroupAndRace(
        groupId,
        raceId,
      );

    for (let i = 0; i < results.length; i++) {
      let fullGuess = false;
      let smallestDiff: number | null = null;
      const fullPointArray: number[] = [];
      let halfPointArray: number[] = [];
      for (const [userId, predictions] of grouppedPredictions) {
        if (results[i].driverId === predictions[i].driverId) {
          fullGuess = true;
          fullPointArray.push(userId);
          halfPointArray = [];
          const newScoreDto = new ScoreDTO();
          newScoreDto.points = 1;
          newScoreDto.position = results[i].position;
          newScoreDto.userId = userId;
          newScoreDto.raceId = raceId;
          scores.push(await this.scoreRepository.save(newScoreDto));
        } else if (!fullGuess) {
          const predictedDriverIndex = predictions.findIndex(
            (prediction) => prediction.driverId === results[i].driverId,
          );
          const diff = Math.abs(i - predictedDriverIndex);
          if (smallestDiff === null || diff <= smallestDiff) {
            if (diff < smallestDiff) {
              halfPointArray = [];
            }
            halfPointArray.push(userId);
            smallestDiff = diff;
          }
        }
      }
      for (const [userId] of grouppedPredictions) {
        if (!fullPointArray.includes(userId)) {
          const newScoreDto = new ScoreDTO();
          newScoreDto.points = halfPointArray.includes(userId) ? 0.5 : 0;
          newScoreDto.position = results[i].position;
          newScoreDto.userId = userId;
          newScoreDto.raceId = raceId;
          scores.push(await this.scoreRepository.save(newScoreDto));
        }
      }
    }
    return scores;
  }
}
