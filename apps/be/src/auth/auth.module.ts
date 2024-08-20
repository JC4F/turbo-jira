import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ApiConfigService } from '@/shared/services';
import { SharedModule } from '@/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [SharedModule],
      useFactory: (apiConfigService: ApiConfigService) => ({
        secret: apiConfigService.jwtSecret,
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ApiConfigService],
    }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
