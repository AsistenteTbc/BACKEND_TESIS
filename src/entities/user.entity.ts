import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Aquí guardaremos el hash, no el texto plano

  @Column({ nullable: true })
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;
}
