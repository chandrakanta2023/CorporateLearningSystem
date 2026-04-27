import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum InterventionType {
  REMINDER = 'reminder',
  ESCALATION = 'escalation',
  WARNING = 'warning',
}

export enum InterventionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

@Entity('interventions')
export class Intervention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enrollmentId: string;

  @Column()
  userId: string;

  @Column()
  courseId: string;

  @Column({
    type: 'simple-enum',
    enum: InterventionType,
    default: InterventionType.REMINDER,
  })
  type: InterventionType;

  @Column({
    type: 'simple-enum',
    enum: InterventionStatus,
    default: InterventionStatus.PENDING,
  })
  status: InterventionStatus;

  @Column('text')
  message: string;

  @Column({ type: 'varchar', nullable: true })
  recipientEmail: string | null;

  @Column({ type: 'varchar', nullable: true })
  assignedBy: string | null;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'integer', default: 0 })
  progress: number;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'text', nullable: true })
  outcomeNotes: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  preInterventionScore: number | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  postInterventionScore: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
