import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class AssessmentInput {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsString()
  assessmentName: string;

  @IsNumber()
  @Min(0)
  score: number;

  @IsNumber()
  @Min(1)
  maxScore: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  attemptNumber?: number;

  @IsDateString()
  assessedAt: string;

  @IsOptional()
  @IsString()
  gradingScale?: string;
}
