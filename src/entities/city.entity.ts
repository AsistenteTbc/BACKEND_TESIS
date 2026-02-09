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

@Entity('city') // Recomendado: poner nombre de tabla explícito
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'zip_code', nullable: true })
  zipCode: string;

  // --- PROVINCIA ---
  @Column({ name: 'province_id' })
  provinceId: number;

  @ManyToOne(() => Province, (province) => province.cities)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  // --- LABORATORIO (AGREGADO ID EXPLÍCITO) ---
  @Column({ name: 'laboratorio_id', nullable: true }) // Puede ser null si aún no se asignó
  laboratorioId: number;

  @ManyToOne(() => Laboratorio, (laboratorio) => laboratorio.cities)
  @JoinColumn({ name: 'laboratorio_id' })
  laboratorio: Laboratorio;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
