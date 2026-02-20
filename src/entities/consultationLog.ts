import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('consultation_log')
export class ConsultationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_id' }) // <--- ESPECIFICAMOS EL NOMBRE REAL
  provinceId: number;

  @Column({ name: 'city_id' })     // <--- ESPECIFICAMOS EL NOMBRE REAL
  cityId: number;

  @Column({ name: 'diagnosis_type', nullable: true })
  diagnosisType: string;

  @Column({ name: 'is_risk_group', default: false })
  isRiskGroup: boolean;

  @Column({ name: 'patient_weight_range', nullable: true })
  patientWeightRange: string;

  @Column({ name: 'result_variant' })
  resultVariant: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
