import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'cuid12345',
  })
  id: string;

  @ApiProperty({ description: 'The username of the user', example: 'johndoe' })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.READER,
  })
  role: Role;

  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2026-03-08T10:00:00.000Z',
  })
  createdAt: Date;
}
