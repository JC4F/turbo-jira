import { InputType, Field, ID } from '@nestjs/graphql';
import { Comment } from '@/comment/entities/comment.entity';

@InputType()
export class CreateCommentInput implements Partial<Comment> {
  @Field({ nullable: true })
  body: string;
  @Field(() => ID, { nullable: true })
  issueId: string;
  @Field(() => ID, { nullable: true })
  userId: string;
}
