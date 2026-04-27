import { CompetencyStatus } from '../../entities/competency-milestone.entity';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CompetencyInput {
  @IsUUID()
  userId: string;

  @IsString()
  competencyCode: string;

  @IsString()
  competencyName: string;

  @IsInt()
  @Min(1)
  currentLevel: number;

  @IsInt()
  @Min(1)
  targetLevel: number;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsEnum(CompetencyStatus)
  status?: CompetencyStatus;
}
