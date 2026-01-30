import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step } from './entities/step.entity';
import { Option } from './entities/option.entity';
import { ConfigModule } from '@nestjs/config';
import { Province } from './entities/province.entity';
import { City } from './entities/city.entity';
import { Laboratorio } from './entities/laboratorio.entity';

@Module({
  imports: [
    // 1. Esto lee el archivo .env de tu carpeta local
    ConfigModule.forRoot(),

    // 2. Configuración de TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      //port: 5432,
      //username: 'postgres',
      //password: 'Postgre12345',
      //database: 'Tuberculosis',
      url: process.env.DATABASE_URL, // <--- Lee la variable que acabas de crear
      entities: [Step, Option, Province, City, Laboratorio],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false, // <--- INDISPENSABLE para conectar con Neon
      },
    }),

    TypeOrmModule.forFeature([Step, Option, Province, City, Laboratorio]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
