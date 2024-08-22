import { LoginAuthInput } from '@/auth/dto/auth.input';
import { AuthData } from '@/auth/types/auth';
import { JwtPayload } from '@/auth/types/auth';
import { UserNotFound } from '@/common';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginAuthInput: LoginAuthInput): Promise<AuthData> {
    const user = await this.userService.findOneByEmail(loginAuthInput.email);

    if (!user) {
      throw new UserNotFound();
    }

    const payload: JwtPayload = { userId: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }
}
