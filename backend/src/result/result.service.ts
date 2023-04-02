import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './result.entity';
import { Repository } from 'typeorm';
import { ResultDTO } from './result.dto';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
  ) {}

  async create(resultDto: ResultDTO): Promise<Result> {
    const result = new Result();
    result.position = resultDto.position;
    result.driverId = resultDto.driverId;
    result.raceId = resultDto.raceId;
    return this.resultRepository.save(result);
  }

  async getAll(): Promise<Result[]> {
    return this.resultRepository.find();
  }

  async getById(id: number): Promise<Result> {
    return this.resultRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.resultRepository.delete(id);
  }
}
