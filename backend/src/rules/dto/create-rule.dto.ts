import { RuleSeverity } from '../../entities/risk-rule.entity';

export interface CreateRuleDto {
  name: string;
  description: string;
  severity?: RuleSeverity;
  definition: Record<string, unknown>;
  isActive?: boolean;
}
