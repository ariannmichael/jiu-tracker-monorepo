import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Difficulty, Category } from '@jiu-tracker/shared';

// Re-export for backward compatibility
export { Difficulty, Category };

@Entity('techniques')
export class Technique {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text', nullable: true, unique: false })
  name: string;

  @Column({ name: 'name_portuguese', type: 'text', nullable: false })
  namePortuguese: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    name: 'description_portuguese',
    type: 'text',
    nullable: false,
  })
  descriptionPortuguese: string;

  @Column({ type: 'bigint', nullable: false })
  category: Category;

  @Column({ type: 'bigint', nullable: false })
  difficulty: Difficulty;
}
