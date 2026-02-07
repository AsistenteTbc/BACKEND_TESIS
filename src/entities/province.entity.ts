import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Laboratorio } from './laboratorio.entity';

@Entity('province')
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  // Cambié el nombre a PLURAL porque es un array
  @OneToMany(() => Laboratorio, (laboratorio) => laboratorio.province)
  laboratorios: Laboratorio[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
