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

  @Column({ name: 'date', type: 'text', nullable: false })
  date: string;

  @Column({ name: 'is_open_mat', type: 'boolean', nullable: false })
  is_open_mat: boolean;

  @ManyToMany(() => Technique)
  @JoinTable({
    name: 'training_session_submit_using_options',
    joinColumn: {
      name: 'training_session_id',
      referencedColumnName: 'id',
    },
  })
  submit_using_options: Technique[];

  @ManyToMany(() => Technique)
  @JoinTable({
    name: 'training_session_tapped_by_options',
    joinColumn: {
      name: 'training_session_id',
      referencedColumnName: 'id',
    },
  })
  tapped_by_options: Technique[];

  @Column({ type: 'bigint', nullable: false })
  duration: number; // in minutes

  @Column({ type: 'text', nullable: false })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
