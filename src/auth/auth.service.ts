import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    username?: string,
    email?: string,
    password?: string,
  ): Promise<AuthResponseDto> {
    if (!username || !email || !password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    this.logger.log(`Register attempt successful for email: ${email}`);

    const payload = {
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    };
  }

  async login(
    emailOrUsername?: string,
    password?: string,
  ): Promise<AuthResponseDto> {
    if (!emailOrUsername || !password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      this.logger.warn(
        `Login attempt failed: user not found for ${emailOrUsername}`,
      );
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(
        `Login attempt failed: invalid password for ${emailOrUsername}`,
      );
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    this.logger.log(`Login attempt successful for email: ${user.email}`);

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
