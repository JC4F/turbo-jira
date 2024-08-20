import { LoginAuthInput } from '@/auth/dto/auth.input';
import { AuthData } from '@/auth/types/auth';
import { JwtPayload } from '@/auth/types/auth';
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
    const payload: JwtPayload = { userId: loginAuthInput.userId };
    const user = await this.userService.findOne(loginAuthInput.userId);
    return {
      access_token: this.jwtService.sign(payload),
      ...user,
    };
  }
}
