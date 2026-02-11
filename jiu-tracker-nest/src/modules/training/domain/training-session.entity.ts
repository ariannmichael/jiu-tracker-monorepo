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
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ name: 'user_id', type: 'text', nullable: false })
  userId: string;

  @Column({ type: 'text', nullable: false })
  user: string;

  @Column({ name: 'date', type: 'text', nullable: false })
  date: string;

  @Column({ name: 'class_time', type: 'text', nullable: false })
  classTime: string;

  @Column({ name: 'rolling_open_mat', type: 'boolean', nullable: false })
  rollingOpenMat: boolean;

  @ManyToMany(() => Technique)
  @JoinTable({
    name: 'training_session_techniques',
    joinColumn: {
      name: 'training_session_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technique_id',
      referencedColumnName: 'id',
    },
  })
  techniques: Technique[];

  @Column({ type: 'bigint', nullable: false })
  duration: number; // in minutes

  @Column({ type: 'text', nullable: false })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
