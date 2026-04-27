import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RiskEvaluationsService } from './risk-evaluations.service';

@Controller('risk-evaluations')
export class RiskEvaluationsController {
  constructor(private readonly riskEvaluationsService: RiskEvaluationsService) {}

  @Post('run')
  runEvaluation() {
    return this.riskEvaluationsService.runEvaluation();
  }

  @Get('latest')
  getLatest(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.riskEvaluationsService.getLatest(parsed);
  }

  @Get('users/:userId')
  getLatestForUser(@Param('userId') userId: string) {
    return this.riskEvaluationsService.getLatestForUser(userId);
  }
}
