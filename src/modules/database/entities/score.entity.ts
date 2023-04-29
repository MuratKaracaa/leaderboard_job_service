import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('Scores_pkey', ['id'], { unique: true })
@Index('Scores_UserId_key', ['userId'], { unique: true })
@Entity('Scores', { schema: 'public' })
export class Score {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'Id' })
  id: number;

  @Column('integer', { name: 'UserId', unique: true })
  userId: number;

  @Column('bigint', { name: 'Score' })
  score: string;
}
