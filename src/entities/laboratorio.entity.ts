// src/laboratorio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { City } from './city.entity';
import { Province } from './province.entity';

@Entity()
export class Laboratorio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  horario: string;

  // Relación: Un laboratorio tiene muchas ciudades
  @OneToMany(() => City, (city) => city.laboratorio)
  cities: City[];

  //Relación: Un laboratorio pertence a una provincia
  @ManyToOne(() => Province, (province) => province.laboratorio)
  @JoinColumn({ name: 'province_id' })
  province: Province;
}