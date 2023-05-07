import { Controller, Get, Param, Delete, Post, Request } from '@nestjs/common';
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
  getAll(): Promise<BonusStat[]> {
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
