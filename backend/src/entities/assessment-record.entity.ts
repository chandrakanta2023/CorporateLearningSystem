import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('assessment_records')
@Index(['userId', 'assessedAt'])
@Index(['courseId', 'assessedAt'])
export class AssessmentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  courseId: string;

  @Column()
  assessmentName: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  score: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  maxScore: number;

  @Column({ type: 'integer', default: 1 })
  attemptNumber: number;

  @Column({ default: false })
  passed: boolean;

  @Column({ type: 'timestamp' })
  assessedAt: Date;

  @Column({ default: 'percentage' })
  gradingScale: string;

  @CreateDateColumn()
  ingestedAt: Date;
}
