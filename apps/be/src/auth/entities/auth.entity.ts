import { User } from '@/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Auth extends User {
  @Field()
  access_token: string;
}
