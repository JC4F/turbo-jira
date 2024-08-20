import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginAuthInput {
  @Field(() => String)
  userId: string;
}

// {
//   "loginAuthInput": {
//     "userId": "0d722e15-532a-43c7-953d-65c87adb49b4"
//   }
// }
