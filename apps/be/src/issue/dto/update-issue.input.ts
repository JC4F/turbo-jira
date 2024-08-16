import { IssuePriority } from '@/constant';
import { CreateIssueInput } from '@/issue/dto/create-issue.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIssueInput extends PartialType(CreateIssueInput) {
  @Field(() => String, { nullable: true })
  priority: IssuePriority;
}
