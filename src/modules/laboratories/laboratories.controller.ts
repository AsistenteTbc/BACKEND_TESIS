import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { LaboratoriesService } from './laboratories.service';
import { CreateLaboratorioDto } from '../../dtos/create-laboratorio.dto';

@Controller('admin/laboratorios')
export class LaboratoriesController {
  constructor(private readonly laboratoriesService: LaboratoriesService) {}

  @Get()
  getAll() {
    return this.laboratoriesService.findAll();
  }

  @Get(':id')
  getFindOne(@Param('id') id: string) {
    return this.laboratoriesService.findOne(+id);
  }

  @Post()
  create(@Body() data: CreateLaboratorioDto) {
    return this.laboratoriesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateLaboratorioDto>) {
    return this.laboratoriesService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.laboratoriesService.remove(+id);
  }
}
