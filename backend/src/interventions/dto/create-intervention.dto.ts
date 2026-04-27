import { InterventionStatus, InterventionType } from '../../entities/intervention.entity';

export interface CreateInterventionDto {
  enrollmentId: string;
  userId: string;
  courseId: string;
  type: InterventionType;
  message: string;
  recipientEmail?: string;
  assignedBy?: string;
  dueDate?: string;
  preInterventionScore?: number;
  status?: InterventionStatus;
}
