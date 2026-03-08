import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

interface RegisterBody {
  username?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  emailOrUsername?: string;
  password?: string;
}

interface AuthResponse {
  token: string;
  id: string;
  email: string;
  username: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterBody): Promise<AuthResponse> {
    const { username, email, password } = body;
    return this.authService.register(username, email, password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBody): Promise<AuthResponse> {
    const { emailOrUsername, password } = body;
    return this.authService.login(emailOrUsername, password);
  }
}
