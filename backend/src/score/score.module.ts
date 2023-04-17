import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './score.entity';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { PredictionModule } from 'src/prediction/prediction.module';
import { Result } from 'src/result/result.entity';

@Module({
  imports: [
    PredictionModule,
    TypeOrmModule.forFeature([Score]),
    TypeOrmModule.forFeature([Result]),
  ],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
