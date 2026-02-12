import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Province } from './province.entity';

@Entity('laboratorio')
export class Laboratorio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 12, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 12, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true }) // Hacemos opcional por si no tienen fijo
  phone: string;

  @Column({ nullable: true }) // Hacemos opcional
  horario: string;

  // --- PROVINCIA (AGREGADO ID EXPLÍCITO) ---
  @Column({ name: 'province_id' })
  provinceId: number;

  @ManyToOne(() => Province, (province) => province.laboratorios) // Nota el plural aquí
  @JoinColumn({ name: 'province_id' })
  province: Province;

  // Relación inversa
  @OneToMany(() => City, (city) => city.laboratorio)
  cities: City[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
