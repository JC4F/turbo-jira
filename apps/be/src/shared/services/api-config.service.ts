import { Environment } from '@/constant';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);
    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll('\\n', '\n');
  }

  get nodeEnv(): Environment {
    return this.getString('NODE_ENV') as Environment;
  }

  get port(): number {
    return this.getNumber('PORT');
  }

  get dbUrl(): string {
    return this.getString('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.getString('JWT_SECRET');
  }

  get sentryDsn(): string {
    return this.getString('SENTRY_DSN');
  }
}
