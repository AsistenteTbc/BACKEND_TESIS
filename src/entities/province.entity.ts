// src/province.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { City } from './city.entity';
import { Laboratorio } from './laboratorio.entity';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relación: Una provincia tiene muchas ciudades
  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  // Relación: Una provincia tiene muchos laboratorios
  @OneToMany(() => Laboratorio, (laboratorio) => laboratorio.province)
  laboratorio: Laboratorio[];
}