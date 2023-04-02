import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './driver.entity';
import { Repository } from 'typeorm';
import { DriverDTO } from './driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(driverDto: DriverDTO): Promise<Driver> {
    const driver = new Driver();
    driver.name = driverDto.name;
    driver.teamId = driverDto.teamId;
    return this.driverRepository.save(driver);
  }

  async getAll(): Promise<Driver[]> {
    return this.driverRepository.find();
  }

  async getById(id: number): Promise<Driver> {
    return this.driverRepository.findOneBy({ id: id });
  }

  async delete(id: number): Promise<void> {
    await this.driverRepository.delete(id);
  }
}
