import { InterventionStatus } from '../../entities/intervention.entity';

export interface UpdateInterventionDto {
  status?: InterventionStatus;
  progress?: number;
  dueDate?: string;
  outcomeNotes?: string;
  postInterventionScore?: number;
  errorMessage?: string;
}
