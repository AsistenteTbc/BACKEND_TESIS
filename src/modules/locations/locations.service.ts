import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../../entities/province.entity';
import { City } from '../../entities/city.entity';
import { CreateCityDto } from '../../dtos/create-city.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Province) private provRepo: Repository<Province>,
    @InjectRepository(City) private cityRepo: Repository<City>,
  ) {}

  // --- PROVINCIAS ---
  async findAllProvinces() {
    return this.provRepo.find({ order: { name: 'ASC' } });
  }

  async findProvinceById(id: number) {
    return this.provRepo.findOneBy({ id });
  }

  async createProvince(data: { name: string }) {
    return this.provRepo.save(this.provRepo.create(data));
  }

  async updateProvince(id: number, data: { name: string }) {
    await this.provRepo.update(id, data);
    return this.findProvinceById(id);
  }

  async deleteProvince(id: number) {
    return this.provRepo.softDelete(id);
  }

  // --- CIUDADES ---
  async findAllCities() {
    return this.cityRepo.find({
      relations: ['province', 'laboratorio'],
      order: { name: 'ASC' },
    });
  }

  async findCityById(id: number) {
    const city = await this.cityRepo.findOne({
      where: { id },
      relations: ['province', 'laboratorio'],
    });
    if (!city) throw new NotFoundException('Ciudad no encontrada');
    return city;
  }

  // Búsqueda por provincia (Para el Wizard)
  async findCitiesByProvinceId(provinceId: number) {
    return this.cityRepo.find({
      where: { provinceId },
      order: { name: 'ASC' },
    });
  }

  async createCity(data: CreateCityDto) {
    const newCity = this.cityRepo.create({
      // Es mejor desestructurar para evitar enviar campos extra que no existen en la entidad
      name: data.name,
      zipCode: data.zipCode,
      provinceId: data.provinceId, // Asignamos la columna ID directamente

      // Asignamos la relación de Provincia
      province: { id: data.provinceId },

      // 👇 AQUÍ ESTÁ EL CAMBIO: Usamos 'undefined' en lugar de 'null'
      laboratorio: data.laboratorioId ? { id: data.laboratorioId } : undefined,
    });

    return await this.cityRepo.save(newCity);
  }

  async updateCity(id: number, data: Partial<CreateCityDto>) {
    const payload: any = { ...data };

    if (data.provinceId) payload.province = { id: data.provinceId };

    if (data.laboratorioId !== undefined) {
      payload.laboratorio = data.laboratorioId
        ? { id: data.laboratorioId }
        : null;
    }

    return await this.cityRepo.save({
      id,
      ...payload,
    });
  }

  async deleteCity(id: number) {
    return this.cityRepo.softDelete(id);
  }

  //Buscar laboratorio por ciudad:
  async findLaboratorioByCityId(cityId: number) {
    const city = await this.cityRepo.findOne({
      where: { id: cityId },
      relations: ['laboratorio'],
    });

    // Si la ciudad existe, devolvemos su laboratorio (o null si no tiene)
    return city ? city.laboratorio : null;
  }
}
