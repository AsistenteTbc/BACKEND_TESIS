import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratorio } from '../../entities/laboratorio.entity';
import { LaboratoriesController } from './laboratories.controller';
import { LaboratoriesService } from './laboratories.service';

//Este módulo se encargará de todo el ciclo de vida de los laboratorios.

@Module({
  imports: [TypeOrmModule.forFeature([Laboratorio])],
  controllers: [LaboratoriesController],
  providers: [LaboratoriesService],
})
export class LaboratoriesModule {}
