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

  async createMany(resultDtoArray: ResultDTO[]): Promise<Result[]> {
    const newResultArray: Result[] = [];
    for (const resultDto of resultDtoArray) {
      const newResult = await this.resultRepository.save(resultDto);
      newResultArray.push(newResult);
    }
    return newResultArray;
  }

  async updateMany(resultArray: Result[]): Promise<Result[]> {
    const updatedResultArray: Result[] = [];
    for (const result of resultArray) {
      const updatedResult = await this.resultRepository.save(result);
      updatedResultArray.push(updatedResult);
    }
    return updatedResultArray;
  }

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

  async getByRaceId(raceId: number): Promise<Result[]> {
    return this.resultRepository.find({
      where: {
        raceId: raceId,
      },
      order: {
        position: 'ASC',
      },
      relations: {
        driver: {
          team: true,
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.resultRepository.delete(id);
  }
}
