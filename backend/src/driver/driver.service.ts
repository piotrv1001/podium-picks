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

  async initDrivers(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find();
    if (drivers.length > 0) {
      return drivers;
    }
    const verstappen = new Driver();
    verstappen.name = 'Max Verstappen';
    verstappen.teamId = 1;
    const perez = new Driver();
    perez.name = 'Sergio Perez';
    perez.teamId = 1;
    const alonso = new Driver();
    alonso.name = 'Fernando Alonso';
    alonso.teamId = 2;
    const stroll = new Driver();
    stroll.name = 'Lance Stroll';
    stroll.teamId = 2;
    const russel = new Driver();
    russel.name = 'George Russell';
    russel.teamId = 3;
    const hamilton = new Driver();
    hamilton.name = 'Lewis Hamilton';
    hamilton.teamId = 3;
    const leclerc = new Driver();
    leclerc.name = 'Charles Leclerc';
    leclerc.teamId = 4;
    const sainz = new Driver();
    sainz.name = 'Carlos Sainz';
    sainz.teamId = 4;
    const piastri = new Driver();
    piastri.name = 'Oscar Piastri';
    piastri.teamId = 5;
    const norris = new Driver();
    norris.name = 'Lando Norris';
    norris.teamId = 5;
    const ocon = new Driver();
    ocon.name = 'Esteban Ocon';
    ocon.teamId = 6;
    const gasly = new Driver();
    gasly.name = 'Pierre Gasly';
    gasly.teamId = 6;
    const hulk = new Driver();
    hulk.name = 'Nico Hulkenberg';
    hulk.teamId = 7;
    const kmag = new Driver();
    kmag.name = 'Kevin Magnussen';
    kmag.teamId = 7;
    const joe = new Driver();
    joe.name = 'Zhou Guanyu';
    joe.teamId = 8;
    const bottas = new Driver();
    bottas.name = 'Valtteri Bottas';
    bottas.teamId = 8;
    const deVries = new Driver();
    deVries.name = 'Nyck de Vries';
    deVries.teamId = 9;
    const tsuonda = new Driver();
    tsuonda.name = 'Yuki Tsunoda';
    tsuonda.teamId = 9;
    const logan = new Driver();
    logan.name = 'Logan Sargeant';
    logan.teamId = 10;
    const albon = new Driver();
    albon.name = 'Alexander Albon';
    albon.teamId = 10;
    return Promise.all([
      this.driverRepository.save(verstappen),
      this.driverRepository.save(perez),
      this.driverRepository.save(alonso),
      this.driverRepository.save(stroll),
      this.driverRepository.save(russel),
      this.driverRepository.save(hamilton),
      this.driverRepository.save(leclerc),
      this.driverRepository.save(sainz),
      this.driverRepository.save(piastri),
      this.driverRepository.save(norris),
      this.driverRepository.save(ocon),
      this.driverRepository.save(gasly),
      this.driverRepository.save(hulk),
      this.driverRepository.save(kmag),
      this.driverRepository.save(joe),
      this.driverRepository.save(bottas),
      this.driverRepository.save(deVries),
      this.driverRepository.save(tsuonda),
      this.driverRepository.save(logan),
      this.driverRepository.save(albon),
    ]);
  }
}
