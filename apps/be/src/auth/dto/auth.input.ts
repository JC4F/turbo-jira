import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginAuthInput {
  @Field(() => String)
  email: string;
}

// {
//   "loginAuthInput": {
//     "email": "jc4f@jira.admin"
//   }
// }
