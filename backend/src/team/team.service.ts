import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { TeamDTO } from './team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(teamDto: TeamDTO): Promise<Team> {
    const team = new Team();
    team.name = teamDto.name;
    team.color = teamDto.color;
    return this.teamRepository.save(team);
  }

  async getAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async getById(id: number): Promise<Team> {
    return this.teamRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.teamRepository.delete(id);
  }
}
