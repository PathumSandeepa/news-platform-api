import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import type { RequestWithUser } from '../common/types/request-with-user.interface';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  private readonly logger: Logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserDto],
  })
  findAll(@Request() req: RequestWithUser): Promise<UserDto[]> {
    this.logger.log(`GET /users by admin ${req.user.id}`);
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Change user role' })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (self demotion or last admin demotion)',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateRole(
    @Param('id') targetUserId: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: RequestWithUser,
  ): Promise<UserDto> {
    this.logger.log(
      `PATCH /users/${targetUserId}/role by admin ${req.user.id}`,
    );
    return this.usersService.updateRole(
      targetUserId,
      updateRoleDto.role,
      req.user.id,
    );
  }
}
