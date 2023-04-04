import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Request,
  Query,
  HttpException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './group.entity';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Request() req, @Query('userId') userId?: number): Promise<Group> {
    return this.groupService.create(req.body, userId);
  }

  @Put()
  async getGroupByCode(
    @Query('code') code: string,
    @Query('userId') userId: number,
  ): Promise<Group> {
    const group = await this.groupService.getGroupByCode(code);
    if (!group) {
      throw new HttpException('Not found', 404);
    }
    return this.groupService.addUserToGroup(userId, group.id);
  }

  @Get()
  getByUserId(@Query('userId') userId: number) {
    return this.groupService.getGroupsByUserId(userId);
  }

  @Get()
  getAll(): Promise<Group[]> {
    return this.groupService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Group> {
    return this.groupService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.groupService.delete(id);
  }
}
