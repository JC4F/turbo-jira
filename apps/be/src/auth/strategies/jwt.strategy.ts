import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ApiConfigService } from '@/shared/services';
import { JwtPayload } from '@/auth/types/auth';
import { InvalidTokenError } from '@/common';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const { userId } = payload;

    const user = await User.findOneBy({ id: userId });
    if (!user) {
      throw new InvalidTokenError(
        'Authentication token is invalid: User not found.',
      );
    }

    return user;
  }
}
