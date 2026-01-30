// option.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Step } from './step.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ name: 'next_step_id' }) // Mapeamos a la columna de la DB
  nextStepId: number;

  // Una opción pertenece a un paso
  @ManyToOne(() => Step, (step) => step.options)
  @JoinColumn({ name: 'step_id' })
  step: Step;

  @Column({ name: 'step_id' })
  stepId: number;
}