import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Season } from './season.entity';
import { Repository } from 'typeorm';
import { SeasonDTO } from './season.dto';

@Injectable()
export class SeasonService {
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
  ) {}

  async create(seasonDto: SeasonDTO): Promise<Season> {
    const season = new Season();
    season.name = seasonDto.name;
    return this.seasonRepository.save(season);
  }

  async getAll(): Promise<Season[]> {
    return this.seasonRepository.find();
  }

  async getById(id: number): Promise<Season> {
    return this.seasonRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.seasonRepository.delete(id);
  }
}
