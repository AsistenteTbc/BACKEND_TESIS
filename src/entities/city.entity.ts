// src/city.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { Laboratorio } from './laboratorio.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'zip_code', nullable: true }) // Código postal (opcional pero útil)
  zipCode: string;

  @Column({ name: 'province_id' })
  provinceId: number;

  // Relación: Una ciudad pertenece a una provincia
  @ManyToOne(() => Province, (province) => province.cities)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @ManyToOne(() => Laboratorio, (laboratorio) => laboratorio.cities)
  @JoinColumn({ name: 'laboratorio_id' })
  laboratorio: Laboratorio;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
