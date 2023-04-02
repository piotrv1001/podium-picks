import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Race } from './race.entity';
import { RaceService } from './race.service';
import { RaceController } from './race.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Race])],
  providers: [RaceService],
  controllers: [RaceController],
})
export class RaceModule {}
