import { GUARDS_METADATA } from '@nestjs/common/constants';
import { AuditController } from '../audit/audit.controller';
import { ComplianceController } from '../compliance/compliance.controller';
import { IngestionController } from '../ingestion/ingestion.controller';
import { RulesController } from '../rules/rules.controller';
import { UsersController } from '../users/users.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ROLES_KEY } from './roles.decorator';
import { RolesGuard } from './roles.guard';

const getRoles = (
  target: Record<string, unknown>,
  method: string,
): string[] | undefined =>
  Reflect.getMetadata(ROLES_KEY, target[method] as object) as
    | string[]
    | undefined;

describe('Authorization Metadata', () => {
  it('protects sensitive controllers with JwtAuthGuard and RolesGuard', () => {
    const controllers = [
      UsersController,
      IngestionController,
      RulesController,
      ComplianceController,
      AuditController,
    ];

    for (const controller of controllers) {
      const guards = Reflect.getMetadata(
        GUARDS_METADATA,
        controller,
      ) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(RolesGuard);
    }
  });

  it('keeps users endpoint role restrictions intact', () => {
    expect(getRoles(UsersController.prototype, 'create')).toEqual([
      'admin',
      'hr',
    ]);
    expect(getRoles(UsersController.prototype, 'findAll')).toEqual([
      'admin',
      'hr',
      'manager',
    ]);
    expect(getRoles(UsersController.prototype, 'remove')).toEqual(['admin']);
  });

  it('keeps ingestion role restrictions intact', () => {
    expect(getRoles(IngestionController.prototype, 'ingestAttendance')).toEqual(
      ['admin', 'hr'],
    );
    expect(
      getRoles(IngestionController.prototype, 'ingestAssessments'),
    ).toEqual(['admin', 'hr']);
    expect(
      getRoles(IngestionController.prototype, 'ingestCompetencies'),
    ).toEqual(['admin', 'hr']);
  });

  it('keeps rules mutation role restrictions intact', () => {
    expect(getRoles(RulesController.prototype, 'create')).toEqual([
      'admin',
      'hr',
    ]);
    expect(getRoles(RulesController.prototype, 'update')).toEqual([
      'admin',
      'hr',
    ]);
    expect(getRoles(RulesController.prototype, 'activate')).toEqual([
      'admin',
      'hr',
    ]);
    expect(getRoles(RulesController.prototype, 'deactivate')).toEqual([
      'admin',
      'hr',
    ]);
  });

  it('keeps compliance and audit role restrictions intact', () => {
    expect(getRoles(ComplianceController.prototype, 'generate')).toEqual([
      'admin',
      'hr',
    ]);
    expect(getRoles(ComplianceController.prototype, 'list')).toEqual([
      'admin',
      'hr',
      'manager',
    ]);
    expect(getRoles(ComplianceController.prototype, 'exportLatestCsv')).toEqual(
      ['admin', 'hr', 'manager'],
    );
    expect(getRoles(AuditController.prototype, 'findAll')).toEqual([
      'admin',
      'hr',
    ]);
  });
});
