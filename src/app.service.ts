import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Step } from './entities/step.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { Laboratorio } from './entities/laboratorio.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Step)
    private stepRepository: Repository<Step>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Laboratorio)
    private laboratorioRepository: Repository<Laboratorio>
  ) {}

  // Busca un paso y trae sus opciones relacionadas
  async getStep(id: number): Promise<Step | null> {
    return this.stepRepository.findOne({
      where: { id },
      relations: ['options'], // ¡Importante! Si no, no te trae los botones
    });
  }

  async getProvinces(): Promise<Province[]> {
    return this.provinceRepository.find();
  }

  async getCitiesByProvince(provinceId: number): Promise<City[]> {
    return this.cityRepository.find({
      where: { provinceId: provinceId },
      order: { name: 'ASC' },
    });
  }

  async getLaboratorios(cityId: number): Promise<Laboratorio | null> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['laboratorio']
    });
    return city ? city.laboratorio : null;
  }
}
