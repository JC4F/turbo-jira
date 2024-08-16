import { InputType, Field } from '@nestjs/graphql';

import { User } from '@/user/entities/user.entity';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  avatarUrl: string;
  @Field({ nullable: true })
  projectId: number;
}
