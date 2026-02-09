import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Province } from '../../entities/province.entity';
import { City } from '../../entities/city.entity';
import { Laboratorio } from '../../entities/laboratorio.entity';

//Este módulo manejará la lectura pública de datos geográficos para el frontend (Wizard).

@Module({
  imports: [TypeOrmModule.forFeature([Province, City, Laboratorio])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
