import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonusStat } from './bonus-stat.entity';
import { BonusStatDTO } from './bonus-stat.dto';

@Injectable()
export class BonusStatService {
  constructor(
    @InjectRepository(BonusStat)
    private readonly bonusStatRepository: Repository<BonusStat>,
  ) {}

  async create(bonusStatDTO: BonusStatDTO): Promise<BonusStat> {
    const bonusStat = new BonusStat();
    bonusStat.points = bonusStatDTO.points;
    bonusStat.bonusStatDictId = bonusStatDTO.bonusStatDictId;
    bonusStat.raceId = bonusStatDTO.raceId;
    bonusStat.groupId = bonusStatDTO.groupId;
    bonusStat.userId = bonusStatDTO.userId;
    return this.bonusStatRepository.save(bonusStat);
  }

  async getAll(): Promise<BonusStat[]> {
    return this.bonusStatRepository.find();
  }

  async getById(id: number): Promise<BonusStat> {
    return this.bonusStatRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.bonusStatRepository.delete(id);
  }
}
