import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusStat } from './bonus-stat.entity';
import { BonusStatService } from './bonus-stat.service';
import { BonusStatController } from './bonus-stat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BonusStat])],
  providers: [BonusStatService],
  controllers: [BonusStatController],
})
export class BonusStatDictModule {}
