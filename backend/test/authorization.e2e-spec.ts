import {
  CanActivate,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  INestApplication,
  Injectable,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { Roles } from '../src/auth/roles.decorator';
import { RolesGuard } from '../src/auth/roles.guard';

type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  user?: {
    role: string;
  };
};

@Injectable()
class TestJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const rawRole = req.headers['x-role'];
    const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;

    if (!role) {
      return false;
    }

    req.user = { role };
    return true;
  }
}

@Controller('secure-users')
@UseGuards(TestJwtAuthGuard, RolesGuard)
class SecureUsersController {
  @Get()
  @Roles('admin', 'hr', 'manager')
  list() {
    return [{ id: 'u1', email: 'u1@corp.com' }];
  }

  @Post()
  @Roles('admin', 'hr')
  create() {
    return { id: 'u2' };
  }

  @Delete(':id')
  @Roles('admin')
  remove() {
    return { message: 'User deactivated' };
  }
}

describe('Authorization (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SecureUsersController],
      providers: [Reflector, RolesGuard, TestJwtAuthGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('denies access when request has no auth role header', async () => {
    await request(app.getHttpServer()).get('/api/v1/secure-users').expect(403);
  });

  it('denies GET for employee role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/secure-users')
      .set('x-role', 'employee')
      .expect(403);
  });

  it('allows GET for manager role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/secure-users')
      .set('x-role', 'manager')
      .expect(200)
      .expect([{ id: 'u1', email: 'u1@corp.com' }]);
  });

  it('allows POST for hr role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-users')
      .set('x-role', 'hr')
      .expect(201)
      .expect({ id: 'u2' });
  });

  it('allows DELETE only for admin role', async () => {
    await request(app.getHttpServer())
      .delete('/api/v1/secure-users/u1')
      .set('x-role', 'hr')
      .expect(403);

    await request(app.getHttpServer())
      .delete('/api/v1/secure-users/u1')
      .set('x-role', 'admin')
      .expect(200)
      .expect({ message: 'User deactivated' });
  });
});

// ---------------------------------------------------------------------------
// Rules domain: GET=admin/hr/manager, POST/PATCH/activate/deactivate=admin/hr
// ---------------------------------------------------------------------------

@Controller('secure-rules')
@UseGuards(TestJwtAuthGuard, RolesGuard)
class SecureRulesController {
  @Get()
  @Roles('admin', 'hr', 'manager')
  list() {
    return [{ id: 'r1', name: 'High Absence Risk' }];
  }

  @Post()
  @Roles('admin', 'hr')
  create() {
    return { id: 'r2' };
  }

  @Patch(':id')
  @Roles('admin', 'hr')
  update(@Param('id') _id: string) {
    return { id: _id, updated: true };
  }

  @Post(':id/activate')
  @Roles('admin', 'hr')
  activate(@Param('id') _id: string) {
    return { id: _id, active: true };
  }

  @Post(':id/deactivate')
  @Roles('admin', 'hr')
  deactivate(@Param('id') _id: string) {
    return { id: _id, active: false };
  }
}

describe('Authorization – Rules domain (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SecureRulesController],
      providers: [Reflector, RolesGuard, TestJwtAuthGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows GET for manager role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/secure-rules')
      .set('x-role', 'manager')
      .expect(200)
      .expect([{ id: 'r1', name: 'High Absence Risk' }]);
  });

  it('denies GET for employee role', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/secure-rules')
      .set('x-role', 'employee')
      .expect(403);
  });

  it('allows POST for hr role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-rules')
      .set('x-role', 'hr')
      .send({ name: 'New Rule' })
      .expect(201)
      .expect({ id: 'r2' });
  });

  it('denies POST for manager role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-rules')
      .set('x-role', 'manager')
      .send({ name: 'New Rule' })
      .expect(403);
  });

  it('allows PATCH for admin role', async () => {
    await request(app.getHttpServer())
      .patch('/api/v1/secure-rules/r1')
      .set('x-role', 'admin')
      .send({ name: 'Updated Rule' })
      .expect(200)
      .expect({ id: 'r1', updated: true });
  });

  it('allows activate/deactivate for hr role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-rules/r1/activate')
      .set('x-role', 'hr')
      .expect(201)
      .expect({ id: 'r1', active: true });

    await request(app.getHttpServer())
      .post('/api/v1/secure-rules/r1/deactivate')
      .set('x-role', 'hr')
      .expect(201)
      .expect({ id: 'r1', active: false });
  });

  it('denies activate for employee role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-rules/r1/activate')
      .set('x-role', 'employee')
      .expect(403);
  });
});

// ---------------------------------------------------------------------------
// Ingestion domain: POST attendance/assessments/competencies = admin/hr only
// ---------------------------------------------------------------------------

@Controller('secure-ingestion')
@UseGuards(TestJwtAuthGuard, RolesGuard)
class SecureIngestionController {
  @Post('attendance')
  @Roles('admin', 'hr')
  ingestAttendance() {
    return { processed: 1 };
  }

  @Post('assessments')
  @Roles('admin', 'hr')
  ingestAssessments() {
    return { processed: 1 };
  }

  @Post('competencies')
  @Roles('admin', 'hr')
  ingestCompetencies() {
    return { processed: 1 };
  }
}

describe('Authorization – Ingestion domain (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SecureIngestionController],
      providers: [Reflector, RolesGuard, TestJwtAuthGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows POST attendance for hr role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-ingestion/attendance')
      .set('x-role', 'hr')
      .send([{ learnerId: 'l1', date: '2026-01-01', status: 'present' }])
      .expect(201)
      .expect({ processed: 1 });
  });

  it('denies POST attendance for manager role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-ingestion/attendance')
      .set('x-role', 'manager')
      .send([])
      .expect(403);
  });

  it('denies POST attendance for employee role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-ingestion/attendance')
      .set('x-role', 'employee')
      .send([])
      .expect(403);
  });

  it('allows POST assessments for admin role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-ingestion/assessments')
      .set('x-role', 'admin')
      .send([])
      .expect(201)
      .expect({ processed: 1 });
  });

  it('allows POST competencies for hr role', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-ingestion/competencies')
      .set('x-role', 'hr')
      .send([])
      .expect(201)
      .expect({ processed: 1 });
  });

  it('denies POST competencies without auth', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/secure-ingestion/competencies')
      .send([])
      .expect(403);
  });
});
