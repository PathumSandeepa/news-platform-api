import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface HCaptchaResponse {
  success: boolean;
}

@Injectable()
export class CaptchaService {
  private readonly logger: Logger = new Logger(CaptchaService.name);
  private readonly hcaptchaUrl = 'https://api.hcaptcha.com/siteverify';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async verifyCaptcha(captchaToken: string | undefined): Promise<void> {
    const skipVerify =
      this.configService.get<string>('HCAPTCHA_SKIP_VERIFY') === 'true';

    if (skipVerify) {
      this.logger.log(
        'CAPTCHA verification skipped (HCAPTCHA_SKIP_VERIFY=true)',
      );
      return;
    }

    if (!captchaToken) {
      this.logger.warn('CAPTCHA verification failed: token is missing');
      throw new BadRequestException('CAPTCHA token is required');
    }

    const secret = this.configService.get<string>('HCAPTCHA_SECRET');

    if (!secret) {
      this.logger.error('HCAPTCHA_SECRET is not configured');
      throw new BadRequestException('CAPTCHA verification failed');
    }

    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', captchaToken);

    const response = await firstValueFrom(
      this.httpService.post<HCaptchaResponse>(
        this.hcaptchaUrl,
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      ),
    );

    if (!response.data.success) {
      this.logger.warn(
        'CAPTCHA verification failed: hCaptcha returned success=false',
      );
      throw new BadRequestException('CAPTCHA verification failed');
    }

    this.logger.log('CAPTCHA verification passed');
  }
}
