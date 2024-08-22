import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';

import is from '@/common/utils/validations';
import { Issue } from '@/issue/entities/issue.entity';
import { User } from '@/user/entities/user.entity';

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  static validations = {
    body: [is.required(), is.maxLength(50000)],
  };

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  body: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => ID)
  @Column('uuid')
  userId: string;

  @Field(() => ID)
  @Column('uuid')
  issueId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Field(() => Issue)
  @ManyToOne(() => Issue, (issue) => issue.comments, { onDelete: 'CASCADE' })
  issue: Relation<Issue>;
}
