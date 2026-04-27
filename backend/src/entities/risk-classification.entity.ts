import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum RiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none',
}

@Entity('risk_classifications')
@Index(['userId', 'evaluatedAt'])
@Index(['riskLevel'])
export class RiskClassification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  ruleId: string | null;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.NONE,
  })
  riskLevel: RiskLevel;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  riskScore: number;

  @Column('text')
  reason: string;

  @Column({ type: 'timestamp' })
  evaluatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
