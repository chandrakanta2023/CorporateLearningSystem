import { CompetencyStatus } from '../../entities/competency-milestone.entity';

export interface CompetencyInput {
  userId: string;
  competencyCode: string;
  competencyName: string;
  currentLevel: number;
  targetLevel: number;
  targetDate?: string;
  status?: CompetencyStatus;
}
