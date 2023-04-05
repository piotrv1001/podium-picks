import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Request,
  Query,
  Put,
} from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { Prediction } from './prediction.entity';

@Controller('predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post('createMany')
  createMany(@Request() req): Promise<Prediction[]> {
    return this.predictionService.createMany(req.body);
  }

  @Post()
  create(@Request() req): Promise<Prediction> {
    return this.predictionService.create(req.body);
  }

  @Put('updateMany')
  updateMany(@Request() req): Promise<Prediction[]> {
    return this.predictionService.updateMany(req.body);
  }

  @Get()
  getByUserAndRace(
    @Query('userId') userId: number,
    @Query('raceId') raceId: number,
  ) {
    return this.predictionService.getByUserAndRace(userId, raceId);
  }

  @Get()
  getAll(): Promise<Prediction[]> {
    return this.predictionService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Prediction> {
    return this.predictionService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.predictionService.delete(id);
  }
}
