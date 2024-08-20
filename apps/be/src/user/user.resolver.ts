import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Auth, AuthUser } from '@/common/decorators';
import { createGuestAccount, signToken } from '@/common';
import { Role } from '@/constant';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  async createGuestAccount(): Promise<string> {
    const user = await createGuestAccount();
    return signToken({ sub: user.id });
  }

  @Auth([Role.ADMIN, Role.USER])
  @Query(() => User)
  currentUser(@AuthUser() authUser: User): User {
    return authUser;
  }

  @Auth([Role.ADMIN, Role.USER])
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }
}
