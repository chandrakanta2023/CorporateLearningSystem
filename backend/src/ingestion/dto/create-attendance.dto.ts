export interface AttendanceInput {
  userId: string;
  courseId: string;
  sessionDate: string;
  attended: boolean;
  attendancePercentage?: number;
  sourceSystem?: string;
}
