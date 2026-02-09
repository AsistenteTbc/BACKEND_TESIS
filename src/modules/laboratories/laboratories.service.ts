import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laboratorio } from '../../entities/laboratorio.entity';
import { CreateLaboratorioDto } from '../../dtos/create-laboratorio.dto';

@Injectable()
export class LaboratoriesService {
  constructor(
    @InjectRepository(Laboratorio)
    private labRepo: Repository<Laboratorio>,
  ) {}

  async findAll() {
    return await this.labRepo.find({
      relations: ['province'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const lab = await this.labRepo.findOne({
      where: { id },
      relations: ['province'],
    });
    if (!lab) throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    return lab;
  }

  async create(data: CreateLaboratorioDto) {
    const newLab = this.labRepo.create(data);
    return await this.labRepo.save(newLab);
  }

  async update(id: number, data: Partial<CreateLaboratorioDto>) {
    await this.labRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.labRepo.softDelete(id);
  }
}
