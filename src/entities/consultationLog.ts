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

  @Column({ name: 'province_name' })
  provinceName: string;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ name: 'diagnosis_type', nullable: true })
  diagnosisType: string; // 'Pulmonar', etc.

  @Column({ name: 'is_risk_group', default: false })
  isRiskGroup: boolean;

  @Column({ name: 'patient_weight_range', nullable: true })
  patientWeightRange: string;

  @Column({ name: 'result_variant' })
  resultVariant: number; // Para saber si fue Urgente o Normal

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
