import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email or username of the user',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string;

  @ApiProperty({ description: 'The password', example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({
    description: 'hCaptcha verification token from the frontend',
    example: '10000000-aaaa-bbbb-cccc-000000000001',
  })
  @IsOptional()
  @IsString()
  captchaToken?: string;
}
