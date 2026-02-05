import { DataSource } from 'typeorm';
import { Option } from './src/entities/option.entity';
import { Step } from './src/entities/step.entity';
import { Province } from './src/entities/province.entity';
import { City } from './src/entities/city.entity';
import { Laboratorio } from './src/entities/laboratorio.entity';
import { ConsultationLog } from './src/entities/consultationLog';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  //port: 5432,
  //username: 'postgres',
  //password: 'Postgre12345',
  //database: 'Tuberculosis',
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Step, Option, Province, City, Laboratorio, ConsultationLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
