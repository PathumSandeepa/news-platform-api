import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserDto[]> {
    this.logger.log('Fetching all users');

    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateRole(
    targetUserId: string,
    newRole: Role,
    adminUserId: string,
  ): Promise<UserDto> {
    this.logger.log(
      `Admin ${adminUserId} attempting to change role of user ${targetUserId} to ${newRole}`,
    );

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      this.logger.warn(
        `User role update failed: Target user ${targetUserId} not found`,
      );
      throw new NotFoundException('User not found');
    }

    if (targetUser.id === adminUserId && newRole !== Role.ADMIN) {
      this.logger.warn(
        `User role update failed: Admin ${adminUserId} tried to demote themselves`,
      );
      throw new ForbiddenException(
        'You cannot change your own role. If you are the only admin, demoting yourself would leave the system without an admin.',
      );
    }

    if (targetUser.role === Role.ADMIN && newRole !== Role.ADMIN) {
      const adminCount = await this.prisma.user.count({
        where: { role: Role.ADMIN },
      });

      if (adminCount <= 1) {
        this.logger.warn(
          `User role update failed: Attempted to demote the only admin (${targetUserId})`,
        );
        throw new ForbiddenException(
          'Cannot change role. This user is the only admin in the system. Assign another admin first.',
        );
      }
    }

    this.logger.log(
      `Updating user ${targetUserId} role from ${targetUser.role} to ${newRole}`,
    );

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }
}
