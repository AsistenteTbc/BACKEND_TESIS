import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Asegúrate de que las rutas a tus entidades sean correctas
import { Province } from '../../entities/province.entity';
import { City } from '../../entities/city.entity';
import { Laboratorio } from '../../entities/laboratorio.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Province)
    private provRepo: Repository<Province>,

    @InjectRepository(City)
    private cityRepo: Repository<City>,

    @InjectRepository(Laboratorio)
    private labRepo: Repository<Laboratorio>,
  ) {}

  // =================================================================
  // 1. GESTIÓN DE PROVINCIAS
  // =================================================================

  async getProvinces() {
    return await this.provRepo.find({
      order: { name: 'ASC' },
      // Importante: TypeORM filtra automáticamente los soft-deleted por defecto.
      // Si quisieras ver los borrados, usarías: withDeleted: true
    });
  }

  async getProvinceById(id: number) {
    const province = await this.provRepo.findOneBy({ id });
    if (!province) throw new NotFoundException(`Provincia ${id} no encontrada`);
    return province;
  }

  async createProvince(data: Partial<Province>) {
    const newProvince = this.provRepo.create(data);
    return await this.provRepo.save(newProvince);
  }

  async updateProvince(id: number, data: Partial<Province>) {
    // Primero actualizamos
    await this.provRepo.update(id, data);
    // Luego devolvemos el objeto actualizado
    return this.getProvinceById(id);
  }

  async deleteProvince(id: number) {
    // softDelete pone la fecha en deleted_at. NO borra la fila de la DB.
    // Esto evita que rompas las estadísticas históricas.
    return await this.provRepo.softDelete(id);
  }

  // =================================================================
  // 2. GESTIÓN DE CIUDADES
  // =================================================================

  async getCities() {
    return await this.cityRepo.find({
      relations: ['province', 'laboratorio'],
      order: { name: 'ASC' },
    });
  }

  async getCityById(id: number) {
    const city = await this.cityRepo.findOne({
      where: { id },
      relations: ['province', 'laboratorio'],
    });
    if (!city) throw new NotFoundException(`Ciudad ${id} no encontrada`);
    return city;
  }

  async createCity(data: any) {
    // TRUCO: Si TypeORM ignora el ID, forzamos la relación
    const payload = {
      ...data,
      // Si viene laboratorioId, creamos el objeto de relación
      laboratorio: data.laboratorioId ? { id: data.laboratorioId } : null,
      province: data.provinceId ? { id: data.provinceId } : null,
    };

    // Usamos save directamente con el objeto (sin .create)
    return await this.cityRepo.save(payload);
  }

  async updateCity(id: number, data: any) {
    const payload = {
      ...data,
      laboratorio: data.laboratorioId ? { id: data.laboratorioId } : null,
      province: data.provinceId ? { id: data.provinceId } : null,
    };

    // Primero actualizamos
    // Nota: update() a veces ignora relaciones, por eso usamos save() con el ID
    await this.cityRepo.save({ id, ...payload });

    return this.getCityById(id);
  }

  async deleteCity(id: number) {
    return await this.cityRepo.softDelete(id);
  }

  // =================================================================
  // 3. GESTIÓN DE LABORATORIOS
  // =================================================================

  async getLaboratorios() {
    return await this.labRepo.find({
      relations: ['province'], // Para saber de qué provincia es el lab
      order: { name: 'ASC' },
    });
  }

  async getLaboratorioById(id: number) {
    const lab = await this.labRepo.findOne({
      where: { id },
      relations: ['province'],
    });
    if (!lab) throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    return lab;
  }

  async createLaboratorio(data: Partial<Laboratorio>) {
    const newLab = this.labRepo.create(data);
    return await this.labRepo.save(newLab);
  }

  async updateLaboratorio(id: number, data: Partial<Laboratorio>) {
    await this.labRepo.update(id, data);
    return this.getLaboratorioById(id);
  }

  async deleteLaboratorio(id: number) {
    return await this.labRepo.softDelete(id);
  }
}
