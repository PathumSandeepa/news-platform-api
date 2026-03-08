import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'CAPTCHA verification failed.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  async register(@Body() body: RegisterDto): Promise<AuthResponseDto> {
    await this.captchaService.verifyCaptcha(body.captchaToken);
    const { username, email, password } = body;
    return this.authService.register(username, email, password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email or username' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'CAPTCHA verification failed.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    await this.captchaService.verifyCaptcha(body.captchaToken);
    const { emailOrUsername, password } = body;
    return this.authService.login(emailOrUsername, password);
  }
}
