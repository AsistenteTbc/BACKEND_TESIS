import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entidades existentes
import { Step } from './entities/step.entity';
import { Option } from './entities/option.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { Laboratorio } from './entities/laboratorio.entity';

// 👇 1. IMPORTA LA NUEVA ENTIDAD DE ESTADÍSTICAS
import { ConsultationLog } from './entities/consultationLog';

// 👇 2. IMPORTA EL MÓDULO DE ESTADÍSTICAS
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // 👇 3. AGREGA ConsultationLog AQUI PARA QUE LA BASE DE DATOS LA RECONOZCA
      entities: [Step, Option, Province, City, Laboratorio, ConsultationLog],
      synchronize: false, // O true si estás en desarrollo y quieres que cree la tabla sola
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    TypeOrmModule.forFeature([Step, Option, Province, City, Laboratorio]),

    // 👇 4. AGREGA EL MÓDULO AL ARRAY DE IMPORTS
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
