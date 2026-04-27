import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { IngestionService } from './ingestion.service';
import { AttendanceInput } from './dto/create-attendance.dto';
import { AssessmentInput } from './dto/create-assessment.dto';
import { CompetencyInput } from './dto/create-competency.dto';

@ApiTags('ingestion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('attendance')
  @Roles('admin', 'hr')
  ingestAttendance(@Body() payload: AttendanceInput[]) {
    return this.ingestionService.ingestAttendance(payload);
  }

  @Post('assessments')
  @Roles('admin', 'hr')
  ingestAssessments(@Body() payload: AssessmentInput[]) {
    return this.ingestionService.ingestAssessments(payload);
  }

  @Post('competencies')
  @Roles('admin', 'hr')
  ingestCompetencies(@Body() payload: CompetencyInput[]) {
    return this.ingestionService.ingestCompetencies(payload);
  }
}
