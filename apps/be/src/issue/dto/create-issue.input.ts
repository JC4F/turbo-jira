import { InputType, Field, ID } from '@nestjs/graphql';

import { IssueType, IssueStatus, IssuePriority } from '@/constant';
import { Issue } from '@/issue/entities/issue.entity';
import { User } from '@/user/entities/user.entity';

@InputType()
class UserInput implements Partial<User> {
  @Field(() => ID)
  id: string;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  avatarUrl: string;
  @Field({ nullable: true })
  projectId: string;
}

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
  @Field(() => [UserInput])
  users: User[];
  @Field(() => [ID])
  userIds: string[];
  @Field(() => String, { nullable: true })
  description: string | null;
}
