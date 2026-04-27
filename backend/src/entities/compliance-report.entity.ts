import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('compliance_reports')
@Index(['generatedAt'])
@Index(['reportType'])
export class ComplianceReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'monthly' })
  reportType: string;

  @Column({ default: 'generated' })
  status: string;

  @Column({ type: 'integer', default: 0 })
  totalEmployees: number;

  @Column({ type: 'integer', default: 0 })
  compliantEmployees: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
  complianceRate: number;

  @Column({ type: 'integer', default: 0 })
  activeInterventions: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  generatedAt: Date;
}
