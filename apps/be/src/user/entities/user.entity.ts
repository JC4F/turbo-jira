import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import is from '@/common/utils/validations';
import { Issue } from '@/issue/entities/issue.entity';
import { Comment } from '@/comment/entities/comment.entity';
import { Project } from '@/project/entities/project.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    email: [is.required(), is.email(), is.maxLength(200)],
  };

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar')
  name: string;

  @Field()
  @Column('varchar')
  email: string;

  @Field()
  @Column('varchar', { length: 2000 })
  avatarUrl: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [Issue])
  @ManyToMany(() => Issue, (issue) => issue.users)
  issues: Issue[];

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.users)
  project: Project;

  @Field()
  @RelationId((user: User) => user.project)
  projectId: number;
}
