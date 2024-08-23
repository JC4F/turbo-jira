import { CreateIssueInput } from '@/issue/dto/create-issue.input';
import { InputType, Field, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateIssueInput extends PartialType(CreateIssueInput) {
  @Field(() => Float, { nullable: true })
  listPosition: number;
}
