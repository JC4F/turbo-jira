import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Auth } from '@/common';
import { Role } from '@/constant';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Auth([Role.ADMIN, Role.USER])
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return await this.commentService.create(createCommentInput);
  }

  @Auth([Role.ADMIN, Role.USER])
  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentService.update(
      updateCommentInput.id,
      updateCommentInput,
    );
  }

  @Auth([Role.ADMIN, Role.USER])
  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => ID }) id: string) {
    return this.commentService.remove(id);
  }
}
