import { RuleSeverity } from '../../entities/risk-rule.entity';

export interface UpdateRuleDto {
  description?: string;
  severity?: RuleSeverity;
  definition?: Record<string, unknown>;
  isActive?: boolean;
}
