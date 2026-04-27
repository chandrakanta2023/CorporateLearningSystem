import { RuleSeverity } from '../../entities/risk-rule.entity';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateRuleDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(RuleSeverity)
  severity?: RuleSeverity;

  @IsOptional()
  @IsObject()
  definition?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
