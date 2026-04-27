import { InterventionStatus } from '../../entities/intervention.entity';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateInterventionDto {
  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  outcomeNotes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  postInterventionScore?: number;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}
