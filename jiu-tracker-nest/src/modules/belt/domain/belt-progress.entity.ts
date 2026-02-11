import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum Belt {
  White = 0,
  Blue = 1,
  Purple = 2,
  Brown = 3,
  Black = 4,
}

@Entity('belt_progresses')
export class BeltProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'varchar', nullable: false })
  userId: string;

  @Column({ type: 'varchar', nullable: false, default: '' })
  user: string;

  @Column({ name: 'current_belt', type: 'int', nullable: false })
  currentBelt: Belt;

  @Column({ name: 'stripe_count', type: 'int', default: 0 })
  stripeCount: number;

  @CreateDateColumn({ name: 'earned_at' })
  earnedAt: Date;
}
