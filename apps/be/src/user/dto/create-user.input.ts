import { InputType, Field, ID } from '@nestjs/graphql';

import { User } from '@/user/entities/user.entity';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  avatarUrl: string;
  @Field(() => ID, { nullable: true })
  projectId: string;
}
