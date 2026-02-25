import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface TopTechniqueRow {
  techniqueId: string;
  name: string;
  count: number;
}

@Entity('analytics')
export class Analytic {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ name: 'user_id', type: 'text', unique: true })
  userId: string;

  @Column({ name: 'current_streak', type: 'int', default: 0 })
  currentStreak: number;

  @Column({ name: 'max_streak', type: 'int', default: 0 })
  maxStreak: number;

  @Column({ name: 'total_sessions', type: 'int', default: 0 })
  totalSessions: number;

  @Column({ name: 'open_mat_sessions', type: 'int', default: 0 })
  openMatSessions: number;

  @Column({ name: 'total_minutes', type: 'int', default: 0 })
  totalMinutes: number;

  @Column({ name: 'days_trained', type: 'int', default: 0 })
  daysTrained: number;

  @Column({ name: 'max_minutes_in_one_day', type: 'int', default: 0 })
  maxMinutesInOneDay: number;

  @Column({ name: 'submissions_count', type: 'int', default: 0 })
  submissionsCount: number;

  @Column({ name: 'tapped_by_count', type: 'int', default: 0 })
  tappedByCount: number;

  @Column({ name: 'win_ratio', type: 'float', default: 0 })
  winRatio: number;

  @Column({ name: 'unique_techniques_count', type: 'int', default: 0 })
  uniqueTechniquesCount: number;

  @Column({
    name: 'top_techniques',
    type: 'jsonb',
    default: () => "'[]'",
  })
  topTechniques: TopTechniqueRow[];

  @Column({
    name: 'category_breakdown',
    type: 'jsonb',
    default: () => "'{}'",
  })
  categoryBreakdown: Record<string, number>;

  @Column({ name: 'last_computed_at', type: 'timestamptz', nullable: true })
  lastComputedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
