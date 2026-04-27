import { Controller, Get, Header, Post, Query } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('reports/generate')
  generate(@Query('type') type?: string) {
    return this.complianceService.generateSummaryReport(type ?? 'monthly');
  }

  @Get('reports')
  list(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : undefined;
    return this.complianceService.getLatestReports(parsed);
  }

  @Get('reports/latest-csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="compliance-report.csv"')
  async exportLatestCsv() {
    return this.complianceService.exportLatestCsv();
  }
}
