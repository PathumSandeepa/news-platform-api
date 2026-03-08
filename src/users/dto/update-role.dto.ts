import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'The new role to assign to the user',
    enum: Role,
    example: Role.EDITOR,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
