import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginAuthInput } from '@/auth/dto/auth.input';
import { Auth } from '@/auth/entities/auth.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async login(@Args('LoginAuthInput') loginAuthInput: LoginAuthInput) {
    return await this.authService.login(loginAuthInput);
  }
}
