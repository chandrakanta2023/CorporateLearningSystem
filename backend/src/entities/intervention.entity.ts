import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum InterventionType {
  REMINDER = 'reminder',
  ESCALATION = 'escalation',
  WARNING = 'warning',
}

export enum InterventionStatus {
  PENDING = 'pending',
  SENT = 'sent',
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
    type: 'enum',
    enum: InterventionType,
    default: InterventionType.REMINDER,
  })
  type: InterventionType;

  @Column({
    type: 'enum',
    enum: InterventionStatus,
    default: InterventionStatus.PENDING,
  })
  status: InterventionStatus;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  recipientEmail: string;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
