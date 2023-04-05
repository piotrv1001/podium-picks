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

  async createMany(predictionDtoArray: PredictionDTO[]): Promise<Prediction[]> {
    const newPredictionArray: Prediction[] = [];
    for (const predictionDto of predictionDtoArray) {
      const newPrediction = await this.predictionRepository.save(predictionDto);
      newPredictionArray.push(newPrediction);
    }
    return newPredictionArray;
  }

  async updateMany(predictionArray: Prediction[]): Promise<Prediction[]> {
    const updatedPredictionArray: Prediction[] = [];
    for (const prediction of predictionArray) {
      const updatedPrediction = await this.predictionRepository.save(
        prediction,
      );
      updatedPredictionArray.push(updatedPrediction);
    }
    return updatedPredictionArray;
  }

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

  async getByUserAndRace(
    userId: number,
    raceId: number,
  ): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: {
        userId: userId,
        raceId: raceId,
      },
      order: {
        predictedPosition: 'ASC',
      },
      relations: {
        driver: {
          team: true,
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.predictionRepository.delete(id);
  }
}
