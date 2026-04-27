import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum RuleSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity('risk_rules')
@Index(['isActive'])
export class RiskRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: RuleSeverity,
    default: RuleSeverity.MEDIUM,
  })
  severity: RuleSeverity;

  @Column({ type: 'jsonb' })
  definition: Record<string, unknown>;

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
