import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Race } from './race.entity';
import { Repository } from 'typeorm';
import { RaceDTO } from './race.dto';

@Injectable()
export class RaceService {
  constructor(
    @InjectRepository(Race)
    private readonly raceRepository: Repository<Race>,
  ) {}

  async create(raceDto: RaceDTO): Promise<Race> {
    const race = new Race();
    race.name = raceDto.name;
    race.date = raceDto.date;
    race.country = raceDto.country;
    return this.raceRepository.save(race);
  }

  async getAll(): Promise<Race[]> {
    return this.raceRepository.find();
  }

  async getById(id: number): Promise<Race> {
    return this.raceRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.raceRepository.delete(id);
  }
}
