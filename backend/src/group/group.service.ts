import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { GroupDTO } from './group.dto';
import { getRandomString } from 'src/util/util';
import { User } from 'src/user/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(groupDto: GroupDTO, userId?: number): Promise<Group> {
    if (userId) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      const group = this.groupRepository.create({
        name: groupDto.name,
        code: getRandomString(10) + Date.now(),
        users: [user],
      });
      return this.groupRepository.save(group);
    }
    const group = new Group();
    group.name = groupDto.name;
    group.code = getRandomString(10) + Date.now();
    return this.groupRepository.save(group);
  }

  async getAll(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  async getById(id: number): Promise<Group> {
    return this.groupRepository.findOneBy({ id: id });
  }

  async getGroupsByUserId(userId: number): Promise<Group[]> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder('group')
      .innerJoin('group.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return queryBuilder;
  }

  async getGroupByCode(code: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: {
        code: code,
      },
    });
  }

  async addUserToGroup(userId: number, groupId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      relations: {
        users: true,
      },
      where: {
        id: groupId,
      },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!group || !user) {
      return group;
    }
    group.users.push(user);
    return this.groupRepository.save(group);
  }

  async delete(id: number): Promise<void> {
    await this.groupRepository.delete(id);
  }
}
