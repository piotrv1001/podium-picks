import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { GroupDTO } from './group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(groupDto: GroupDTO): Promise<Group> {
    const group = new Group();
    group.name = groupDto.name;
    group.code = groupDto.code;
    return this.groupRepository.save(group);
  }

  async getAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  async getById(id: number): Promise<Group> {
    return this.groupRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.groupRepository.delete(id);
  }
}
