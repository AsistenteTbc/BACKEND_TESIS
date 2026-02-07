import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

// Importamos las entidades que el AdminService necesita manipular
import { Province } from '../../entities/province.entity';
import { City } from '../../entities/city.entity';
import { Laboratorio } from '../../entities/laboratorio.entity';

@Module({
  imports: [
    // Registramos las tablas para que el Servicio pueda hacer .find(), .save(), etc.
    TypeOrmModule.forFeature([Province, City, Laboratorio]),
  ],
  controllers: [AdminController], // Registramos las rutas (/admin/...)
  providers: [AdminService], // Registramos la lógica
})
export class AdminModule {}
