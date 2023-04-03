import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { DriverModule } from './driver/driver.module';
import { RaceModule } from './race/race.module';
import { GroupModule } from './group/group.module';
import { PredictionModule } from './prediction/prediction.module';
import { ResultModule } from './result/result.module';
import { ScoreModule } from './score/score.module';
import { Prediction } from './prediction/prediction.entity';
import { Score } from './score/score.entity';
import { Result } from './result/result.entity';
import { Race } from './race/race.entity';
import { Driver } from './driver/driver.entity';
import { Group } from './group/group.entity';
import { Team } from './team/team.entity';
import { SeasonModule } from './season/season.module';
import { Season } from './season/season.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,
          Prediction,
          Score,
          Result,
          Race,
          Driver,
          Group,
          Team,
          Season,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    TeamModule,
    DriverModule,
    RaceModule,
    GroupModule,
    PredictionModule,
    ResultModule,
    ScoreModule,
    SeasonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
