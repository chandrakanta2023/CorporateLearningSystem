import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ComplianceService } from './compliance.service';

@ApiTags('compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('reports/generate')
  @Roles('admin', 'hr')
  generate(@Query('type') type?: string) {
    return this.complianceService.generateSummaryReport(type ?? 'monthly');
  }

  @Get('reports')
  @Roles('admin', 'hr', 'manager')
  list(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.complianceService.getLatestReports(parsed);
  }

  @Get('reports/latest-csv')
  @Roles('admin', 'hr', 'manager')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="compliance-report.csv"')
  async exportLatestCsv() {
    return this.complianceService.exportLatestCsv();
  }
}
