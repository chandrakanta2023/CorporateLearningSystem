import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('attendance_records')
@Index(['userId', 'sessionDate'])
@Index(['courseId', 'sessionDate'])
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  courseId: string;

  @Column({ type: 'date' })
  sessionDate: string;

  @Column({ default: true })
  attended: boolean;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  attendancePercentage: number;

  @Column({ default: 'manual' })
  sourceSystem: string;

  @CreateDateColumn()
  ingestedAt: Date;
}
