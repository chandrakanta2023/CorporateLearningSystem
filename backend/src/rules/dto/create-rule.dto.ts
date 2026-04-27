import { RuleSeverity } from '../../entities/risk-rule.entity';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRuleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(RuleSeverity)
  severity?: RuleSeverity;

  @IsObject()
  definition: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
