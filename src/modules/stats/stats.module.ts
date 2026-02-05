import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { ConsultationLog } from '../../entities/consultationLog';

@Module({
  imports: [
    // 1. Registramos la entidad para que este módulo pueda usar la base de datos
    TypeOrmModule.forFeature([ConsultationLog]),
  ],
  controllers: [StatsController], // 2. Registramos los endpoints
  providers: [StatsService], // 3. Registramos la lógica de negocio
  exports: [StatsService], // 4. Exportamos el servicio (buena práctica)
})
export class StatsModule {}
