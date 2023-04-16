import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { Repository } from 'typeorm';
import { ScoreDTO } from './score.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
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
}
