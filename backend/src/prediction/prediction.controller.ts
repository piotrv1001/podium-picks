import { Controller, Post, Get, Delete, Param, Request } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { Prediction } from './prediction.entity';

@Controller('predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post()
  create(@Request() req): Promise<Prediction> {
    return this.predictionService.create(req.body);
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
