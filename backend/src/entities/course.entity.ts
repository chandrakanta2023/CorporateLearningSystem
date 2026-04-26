import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Enrollment } from './enrollment.entity';

export enum CourseType {
  MANDATORY = 'mandatory',
  OPTIONAL = 'optional',
  CERTIFICATION = 'certification',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: CourseType,
    default: CourseType.OPTIONAL,
  })
  type: CourseType;

  @Column({ type: 'integer', default: 0 })
  durationHours: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ nullable: true })
  department: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
