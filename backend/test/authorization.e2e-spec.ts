import {
  CanActivate,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  INestApplication,
  Injectable,
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
