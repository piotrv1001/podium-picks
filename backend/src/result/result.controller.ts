import {
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ResultService } from './result.service';
import { Result } from './result.entity';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('createMany')
  createMany(@Request() req): Promise<Result[]> {
    return this.resultService.createMany(req.body);
  }

  @Post()
  create(@Request() req): Promise<Result> {
    return this.resultService.create(req.body);
  }

  @Put('updateMany')
  updateMany(@Request() req): Promise<Result[]> {
    return this.resultService.updateMany(req.body);
  }

  @Get()
  getByRaceId(@Query('raceId') raceId: number): Promise<Result[]> {
    return this.resultService.getByRaceId(raceId);
  }

  @Get()
  getAll(): Promise<Result[]> {
    return this.resultService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<Result> {
    return this.resultService.getById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.resultService.delete(id);
  }
}
