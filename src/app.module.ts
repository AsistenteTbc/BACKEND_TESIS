import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entidades
import { Step } from './entities/step.entity';
import { Option } from './entities/option.entity';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { Laboratorio } from './entities/laboratorio.entity';
import { ConsultationLog } from './entities/consultationLog';
import { User } from './entities/user.entity';

// Módulos
import { StatsModule } from './modules/stats/stats.module';
import { WizardModule } from './modules/wizard/wizard.module';
import { LocationsModule } from './modules/locations/locations.module';
import { LaboratoriesModule } from './modules/laboratories/laboratories.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        Step,
        Option,
        Province,
        City,
        Laboratorio,
        ConsultationLog,
        User,
      ],
      synchronize: false,
      ssl: { rejectUnauthorized: false },
    }),

    // Módulos funcionales
    StatsModule,
    WizardModule,
    LocationsModule,
    LaboratoriesModule,
    AuthModule,
  ],
})
export class AppModule {}
