import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from '@/comment/entities/comment.entity';
import { createEntity, deleteEntity, updateEntity } from '@/common';

@Injectable()
export class CommentService {
  async create(createCommentInput: CreateCommentInput) {
    return await createEntity(Comment, createCommentInput);
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentInput: UpdateCommentInput) {
    return await updateEntity(Comment, id, updateCommentInput);
  }

  async remove(id: number) {
    return await deleteEntity(Comment, id);
  }
}
