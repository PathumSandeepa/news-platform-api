import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestWithUser } from '../types/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger: Logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user || request.user.role === undefined) {
      this.logger.warn('Role access denied: no user role in request');
      return false;
    }

    const hasRole = requiredRoles.includes(request.user.role);
    if (!hasRole) {
      this.logger.warn(
        `Role access denied. Required: ${requiredRoles.join(', ')}. Actual: ${request.user.role}`,
      );
    }

    return hasRole;
  }
}
