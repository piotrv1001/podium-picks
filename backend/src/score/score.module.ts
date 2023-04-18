import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { PredictionModule } from 'src/prediction/prediction.module';
import { Result } from 'src/result/result.entity';
import { Group } from 'src/group/group.entity';

@Module({
  imports: [
    PredictionModule,
    TypeOrmModule.forFeature([Score]),
    TypeOrmModule.forFeature([Result]),
    TypeOrmModule.forFeature([Group]),
  ],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
