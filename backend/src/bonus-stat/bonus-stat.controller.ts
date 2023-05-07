import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Request,
  Query,
} from '@nestjs/common';
import { BonusStatService } from './bonus-stat.service';
import { BonusStat } from './bonus-stat.entity';

@Controller('bonus-stats')
export class BonusStatController {
  constructor(private readonly bonusStatService: BonusStatService) {}

  @Post()
  create(@Request() req): Promise<BonusStat> {
    return this.bonusStatService.create(req.body);
  }

  @Get()
  async getBonusStats(
    @Query('raceId') raceId?: number,
    @Query('groupId') groupId?: number,
    @Query('userId') userId?: number,
  ) {
    if (raceId !== undefined && groupId !== undefined) {
      if (userId !== undefined) {
        return this.bonusStatService.getByRaceGroupUser(
          raceId,
          groupId,
          userId,
        );
      }
      const groupedBonusStats = await this.bonusStatService.getByRaceGroup(
        raceId,
        groupId,
      );

      const response = {};
      groupedBonusStats.forEach((bonusStats, userId) => {
        response[userId] = bonusStats;
      });

      return response;
    }
    return this.bonusStatService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<BonusStat> {
    return this.bonusStatService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.bonusStatService.delete(id);
  }
}