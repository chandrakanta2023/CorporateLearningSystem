import {
  InterventionStatus,
  InterventionType,
} from '../../entities/intervention.entity';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateInterventionDto {
  @IsUUID()
  enrollmentId: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;

  @IsEnum(InterventionType)
  type: InterventionType;

  @IsString()
  message: string;

  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  assignedBy?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  preInterventionScore?: number;

  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;
}
