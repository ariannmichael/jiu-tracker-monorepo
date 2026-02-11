import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum Difficulty {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

export enum Category {
  Submission = 0,
  Sweep = 1,
  Pass = 2,
  Guard = 3,
  Takedown = 4,
  Defend = 5,
  SubmissionEscape = 6,
}

@Entity('techniques')
export class Technique {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ name: 'name_portuguese', type: 'varchar', nullable: false })
  namePortuguese: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({
    name: 'description_portuguese',
    type: 'varchar',
    nullable: false,
  })
  descriptionPortuguese: string;

  @Column({ type: 'int', nullable: false })
  category: Category;

  @Column({ type: 'int', nullable: false })
  difficulty: Difficulty;
}
