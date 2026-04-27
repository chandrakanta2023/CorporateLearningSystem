import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AttendanceInput } from './dto/create-attendance.dto';
import { AssessmentInput } from './dto/create-assessment.dto';
import { CompetencyInput } from './dto/create-competency.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('attendance')
  ingestAttendance(@Body() payload: AttendanceInput[]) {
    return this.ingestionService.ingestAttendance(payload);
  }

  @Post('assessments')
  ingestAssessments(@Body() payload: AssessmentInput[]) {
    return this.ingestionService.ingestAssessments(payload);
  }

  @Post('competencies')
  ingestCompetencies(@Body() payload: CompetencyInput[]) {
    return this.ingestionService.ingestCompetencies(payload);
  }
}
