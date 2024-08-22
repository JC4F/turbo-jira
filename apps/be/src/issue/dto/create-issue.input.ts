import { InputType, Field, ID } from '@nestjs/graphql';

import { IssueType, IssueStatus, IssuePriority } from '@/constant';
import { Issue } from '@/issue/entities/issue.entity';
import { User } from '@/user/entities/user.entity';
import { CreateUserInput } from '@/user/dto/create-user.input';

@InputType()
export class CreateIssueInput implements Partial<Issue> {
  @Field()
  title: string;
  @Field(() => String)
  type: IssueType;
  @Field(() => String)
  status: IssueStatus;
  @Field(() => String)
  priority: IssuePriority;
  @Field(() => ID)
  reporterId: string;
  @Field(() => ID)
  projectId: string;
  @Field(() => [CreateUserInput])
  users: User[];
  @Field(() => [ID])
  userIds: string[];
  @Field(() => String, { nullable: true })
  description: string | null;
}
