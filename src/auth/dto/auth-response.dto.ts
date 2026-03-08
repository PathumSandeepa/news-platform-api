import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT authentication token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({ description: 'User unique ID', example: 'cuid1234567890' })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({ description: 'User handle/username', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'Assigned system role', example: 'READER' })
  role: string;
}
