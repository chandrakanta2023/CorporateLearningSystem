import { validate } from 'class-validator';
import { AttendanceInput } from './ingestion/dto/create-attendance.dto';
import { AssessmentInput } from './ingestion/dto/create-assessment.dto';
import { CompetencyInput } from './ingestion/dto/create-competency.dto';
import { CreateInterventionDto } from './interventions/dto/create-intervention.dto';
import { InterventionType } from './entities/intervention.entity';
import { CreateRuleDto } from './rules/dto/create-rule.dto';

const make = <T extends object>(cls: new () => T, payload: Partial<T>): T =>
  Object.assign(new cls(), payload);

const propertiesWithErrors = async <T extends object>(
  instance: T,
): Promise<string[]> => {
  const errors = await validate(instance);
  return errors.map((error) => error.property);
};

describe('DTO Validation', () => {
  it('accepts a valid attendance payload', async () => {
    const dto = make(AttendanceInput, {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      courseId: '550e8400-e29b-41d4-a716-446655440001',
      sessionDate: '2026-01-15',
      attended: true,
      attendancePercentage: 95,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid attendance UUID and percentage range', async () => {
    const dto = make(AttendanceInput, {
      userId: 'bad-id',
      courseId: '550e8400-e29b-41d4-a716-446655440001',
      sessionDate: '2026-01-15',
      attended: true,
      attendancePercentage: 101,
    });

    const properties = await propertiesWithErrors(dto);

    expect(properties).toContain('userId');
    expect(properties).toContain('attendancePercentage');
  });

  it('rejects invalid assessment maxScore and attemptNumber', async () => {
    const dto = make(AssessmentInput, {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      courseId: '550e8400-e29b-41d4-a716-446655440001',
      assessmentName: 'Quiz 1',
      score: 10,
      maxScore: 0,
      attemptNumber: 21,
      assessedAt: '2026-01-15',
    });

    const properties = await propertiesWithErrors(dto);

    expect(properties).toContain('maxScore');
    expect(properties).toContain('attemptNumber');
  });

  it('rejects invalid competency levels and enum status', async () => {
    const dto = make(CompetencyInput, {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      competencyCode: 'COMP-001',
      competencyName: 'Data Analysis',
      currentLevel: 0,
      targetLevel: 0,
      status: 'done' as unknown as never,
    });

    const properties = await propertiesWithErrors(dto);

    expect(properties).toContain('currentLevel');
    expect(properties).toContain('targetLevel');
    expect(properties).toContain('status');
  });

  it('rejects invalid intervention email and score bounds', async () => {
    const dto = make(CreateInterventionDto, {
      enrollmentId: '550e8400-e29b-41d4-a716-446655440002',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      courseId: '550e8400-e29b-41d4-a716-446655440001',
      type: InterventionType.REMINDER,
      message: 'Please complete the module',
      recipientEmail: 'not-an-email',
      preInterventionScore: 101,
    });

    const properties = await propertiesWithErrors(dto);

    expect(properties).toContain('recipientEmail');
    expect(properties).toContain('preInterventionScore');
  });

  it('rejects invalid rule definition object and boolean flag', async () => {
    const dto = make(CreateRuleDto, {
      name: 'Low Attendance',
      description: 'Flags low attendance',
      definition: 'threshold:75' as unknown as Record<string, unknown>,
      isActive: 'yes' as unknown as boolean,
    });

    const properties = await propertiesWithErrors(dto);

    expect(properties).toContain('definition');
    expect(properties).toContain('isActive');
  });
});
