import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RiskEvaluationsService } from './risk-evaluations.service';

@ApiTags('risk-evaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('risk-evaluations')
export class RiskEvaluationsController {
  constructor(private readonly riskEvaluationsService: RiskEvaluationsService) {}

  @Post('run')
  @Roles('admin', 'hr')
  runEvaluation() {
    return this.riskEvaluationsService.runEvaluation();
  }

  @Get('latest')
  @Roles('admin', 'hr', 'manager')
  getLatest(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.riskEvaluationsService.getLatest(parsed);
  }

  @Get('users/:userId')
  @Roles('admin', 'hr', 'manager')
  getLatestForUser(@Param('userId') userId: string) {
    return this.riskEvaluationsService.getLatestForUser(userId);
  }
}
