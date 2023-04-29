import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { Repository } from 'typeorm';
import { ScoreDTO } from './score.dto';
import { Result } from 'src/result/result.entity';
import { PredictionService } from 'src/prediction/prediction.service';
import { Group } from 'src/group/group.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly predictionService: PredictionService,
  ) {}

  async create(scoreDto: ScoreDTO): Promise<Score> {
    const score = new Score();
    score.points = scoreDto.points;
    score.position = scoreDto.position;
    score.userId = scoreDto.userId;
    score.raceId = scoreDto.raceId;
    score.groupId = scoreDto.groupId;
    return this.scoreRepository.save(score);
  }

  async updateMany(scoreDtoArray: Score[]): Promise<Score[]> {
    const updatedScoreArray: Score[] = [];
    for (const score of scoreDtoArray) {
      const updatedScore = await this.scoreRepository.save(score);
      updatedScoreArray.push(updatedScore);
    }
    return updatedScoreArray;
  }

  async getAll(): Promise<Score[]> {
    return this.scoreRepository.find();
  }

  async getById(id: number): Promise<Score> {
    return this.scoreRepository.findOneBy({ id: id });
  }

  async getByUserGroupRace(
    userId: number,
    groupId: number,
    raceId: number,
  ): Promise<Score[]> {
    return this.scoreRepository.find({
      where: {
        userId,
        raceId,
        groupId,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.scoreRepository.delete(id);
  }

  async getScoresByGroupAndRace(
    groupId: number,
    raceId: number,
  ): Promise<Map<number, Score[]>> {
    const scores = await this.scoreRepository.find({
      where: { groupId, raceId },
      order: { position: 'ASC' },
    });
    const group = await this.groupRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        id: groupId,
      },
    });
    if (!group) {
      throw new Error(`Group with ID ${groupId} not found`);
    }
    const userIds = group.users.map((user) => user.id);
    const grouppedScores = new Map<number, Score[]>();
    scores.forEach((score) => {
      const userId = score.userId;
      if (grouppedScores.has(userId)) {
        const userScores = grouppedScores.get(userId);
        userScores.push(score);
        grouppedScores.set(userId, userScores);
      } else {
        grouppedScores.set(userId, [score]);
      }
    });

    userIds.forEach((userId) => {
      if (!grouppedScores.has(userId)) {
        grouppedScores.set(userId, []);
      }
    });

    return grouppedScores;
  }

  async calculateScoresForRaceForGroup(
    raceId: number,
    groupId: number,
    results: Result[],
  ): Promise<Score[]> {
    const scores: Score[] = [];
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
        if (predictions.length === 0) {
          continue;
        }
        if (results[i].driverId === predictions[i].driverId) {
          fullGuess = true;
          fullPointArray.push(userId);
          halfPointArray = [];
          const existingScore = await this.scoreRepository.findOne({
            where: {
              userId: userId,
              raceId: raceId,
              groupId: groupId,
              position: results[i].position,
            },
          });
          if (existingScore) {
            existingScore.points = 1;
            scores.push(await this.scoreRepository.save(existingScore));
          } else {
            const newScoreDto = new ScoreDTO();
            newScoreDto.points = 1;
            newScoreDto.position = results[i].position;
            newScoreDto.userId = userId;
            newScoreDto.raceId = raceId;
            newScoreDto.groupId = groupId;
            scores.push(await this.scoreRepository.save(newScoreDto));
          }
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
          const existingScore = await this.scoreRepository.findOne({
            where: {
              userId: userId,
              raceId: raceId,
              groupId: groupId,
              position: results[i].position,
            },
          });
          if (existingScore) {
            existingScore.points = halfPointArray.includes(userId) ? 0.5 : 0;
            scores.push(await this.scoreRepository.save(existingScore));
          } else {
            const newScoreDto = new ScoreDTO();
            newScoreDto.points = halfPointArray.includes(userId) ? 0.5 : 0;
            newScoreDto.position = results[i].position;
            newScoreDto.userId = userId;
            newScoreDto.raceId = raceId;
            newScoreDto.groupId = groupId;
            scores.push(await this.scoreRepository.save(newScoreDto));
          }
        }
      }
    }
    return scores;
  }

  async sumPointsByUserIdAndGroupIdAndSeasonId(
    userId: number,
    groupId: number,
    seasonId: number,
  ): Promise<number> {
    const queryBuilder = this.scoreRepository
      .createQueryBuilder('s')
      .select('SUM(s.points)', 'sum_points')
      .innerJoin('s.race', 'r')
      .where('s.userId = :userId', { userId })
      .andWhere('s.groupId = :groupId', { groupId })
      .andWhere('r.seasonId = :seasonId', { seasonId });

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.sum_points);
  }

  async getSumPointsByGroupIdAndSeasonId(
    groupId: number,
    seasonId: number,
  ): Promise<Map<number, number>> {
    const users = await this.scoreRepository.query(
      `
    SELECT DISTINCT userId
    FROM score
    WHERE groupId = ?`,
      [groupId],
    );

    const userIds = users.map((user) => user.userId);
    const resultMap = new Map<number, number>(
      userIds.map((userId) => [userId, 0]),
    );
    const scores = await this.scoreRepository
      .createQueryBuilder('s')
      .select(['s.userId as userId', 'SUM(s.points) as sum_points'])
      .innerJoin('s.race', 'r')
      .where('s.groupId = :groupId', { groupId })
      .andWhere('r.seasonId = :seasonId', { seasonId })
      .groupBy('s.userId')
      .getRawMany();

    scores.forEach((score) => {
      resultMap.set(score.userId, parseFloat(score.sum_points));
    });

    return resultMap;
  }
}
