import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Technique } from '../../technique/domain/technique.entity';

@Entity('training_sessions')
export class TrainingSession {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ name: 'user_id', type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  user: string;

  @ManyToMany(() => Technique)
  @JoinTable({ name: 'training_session_techniques' })
  techniques: Technique[];

  @Column({ type: 'int', nullable: false })
  duration: number; // in minutes

  @Column({ type: 'varchar', nullable: false })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
