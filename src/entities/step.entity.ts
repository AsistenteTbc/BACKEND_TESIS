// step.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Option } from './option.entity';

@Entity()
export class Step {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  code: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: false })
  is_end: boolean;

  @Column({ default: 1 })
  variant: number; // 1=Info, 2=Success, 3=Warning, 4=Danger

  // Un paso tiene muchas opciones (botones)
  @OneToMany(() => Option, (option) => option.step)
  options: Option[];
}
