import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prediction } from './prediction.entity';
import { Repository } from 'typeorm';
import { PredictionDTO } from './prediction.dto';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(Prediction)
    private readonly predictionRepository: Repository<Prediction>,
  ) {}

  async create(predictionDto: PredictionDTO): Promise<Prediction> {
    const prediction = new Prediction();
    prediction.predictedPosition = predictionDto.predictedPosition;
    prediction.driverId = predictionDto.driverId;
    prediction.raceId = predictionDto.raceId;
    prediction.userId = predictionDto.userId;
    return this.predictionRepository.save(prediction);
  }

  async getAll(): Promise<Prediction[]> {
    return this.predictionRepository.find();
  }

  async getById(id: number): Promise<Prediction> {
    return this.predictionRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.predictionRepository.delete(id);
  }
}
