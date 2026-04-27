export interface AssessmentInput {
  userId: string;
  courseId: string;
  assessmentName: string;
  score: number;
  maxScore: number;
  attemptNumber?: number;
  assessedAt: string;
  gradingScale?: string;
}
