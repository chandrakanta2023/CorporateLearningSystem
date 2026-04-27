import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

type RequestShape = {
  user?: {
    role: string;
  };
};

const makeContext = (role?: string): ExecutionContext => {
  const request: RequestShape = role ? { user: { role } } : {};
  return {
    getHandler: () => ({}) as object,
    getClass: () => class {} as object,
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
};

describe('RolesGuard', () => {
  const reflectorMock: {
    getAllAndOverride: jest.Mock;
  } = {
    getAllAndOverride: jest.fn(),
  };

  let guard: RolesGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(reflectorMock);
  });

  it('allows access when no roles are required', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);

    const allowed = guard.canActivate(makeContext('employee'));

    expect(allowed).toBe(true);
  });

  it('allows access when user role is included in required roles', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['admin', 'hr']);

    const allowed = guard.canActivate(makeContext('admin'));

    expect(allowed).toBe(true);
  });

  it('denies access when user role is not included in required roles', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['admin', 'hr']);

    const allowed = guard.canActivate(makeContext('employee'));

    expect(allowed).toBe(false);
  });

  it('denies access when roles are required but request has no user', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(['admin']);

    const allowed = guard.canActivate(makeContext());

    expect(allowed).toBe(false);
  });
});
