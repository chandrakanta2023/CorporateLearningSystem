import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class AttendanceInput {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsDateString()
  sessionDate: string;

  @IsBoolean()
  attended: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  attendancePercentage?: number;

  @IsOptional()
  @IsString()
  sourceSystem?: string;
}
