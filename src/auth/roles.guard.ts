import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

interface RequestWithUser {
  user?: {
    role?: Role;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger: Logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: Role[] | undefined = this.reflector.getAllAndOverride<
      Role[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();

    if (!request.user || request.user.role === undefined) {
      this.logger.warn('Role access denied: no user role in request');
      return false;
    }

    const hasRole: boolean = requiredRoles.includes(request.user.role);
    if (!hasRole) {
      this.logger.warn(
        `Role access denied. Required: ${requiredRoles.join(', ')}. Actual: ${request.user.role}`,
      );
    }

    return hasRole;
  }
}
