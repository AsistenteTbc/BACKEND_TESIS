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

// 👇 2. IMPORTAR LOS MÓDULOS DE FUNCIONALIDAD
import { StatsModule } from './modules/stats/stats.module';
import { AdminModule } from './modules/admin/admin.module'; // <--- ¡NUEVO! ESTO FALTABA

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // 👇 3. ASEGURATE QUE ESTÉN TODAS LAS ENTIDADES AQUÍ
      entities: [Step, Option, Province, City, Laboratorio, ConsultationLog],
      synchronize: false, // O true si estás en desarrollo
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    // Esto permite usar los repositorios básicos en AppService (si los usas)
    TypeOrmModule.forFeature([Step, Option, Province, City, Laboratorio]),

    // 👇 4. REGISTRAR LOS MÓDULOS DE LA APLICACIÓN
    StatsModule,
    AdminModule, // <--- AGREGADO: Habilita las rutas /admin/...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
