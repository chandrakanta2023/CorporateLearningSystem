import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum CompetencyStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ACHIEVED = 'achieved',
  OVERDUE = 'overdue',
}

@Entity('competency_milestones')
@Index(['userId', 'competencyCode'], { unique: true })
export class CompetencyMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  competencyCode: string;

  @Column()
  competencyName: string;

  @Column({ type: 'integer', default: 1 })
  currentLevel: number;

  @Column({ type: 'integer', default: 1 })
  targetLevel: number;

  @Column({ type: 'date', nullable: true })
  targetDate: string | null;

  @Column({ type: 'timestamp', nullable: true })
  achievedAt: Date | null;

  @Column({
    type: 'enum',
    enum: CompetencyStatus,
    default: CompetencyStatus.NOT_STARTED,
  })
  status: CompetencyStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
