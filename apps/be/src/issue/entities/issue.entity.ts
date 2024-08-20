import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import striptags from 'striptags';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import is from '@/common/utils/validations';
import { Comment } from '@/comment/entities/comment.entity';
import { IssuePriority, IssueStatus, IssueType } from '@/constant';
import { Project } from '@/project/entities/project.entity';
import { User } from '@/user/entities/user.entity';

@ObjectType()
@Entity()
export class Issue extends BaseEntity {
  static validations = {
    title: [is.required(), is.maxLength(200)],
    type: [is.required(), is.oneOf(Object.values(IssueType))],
    status: [is.required(), is.oneOf(Object.values(IssueStatus))],
    priority: [is.required(), is.oneOf(Object.values(IssuePriority))],
    listPosition: is.required(),
    reporterId: is.required(),
  };

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('varchar')
  title: string;

  @Field(() => String)
  @Column('varchar')
  type: IssueType;

  @Field(() => String)
  @Column('varchar')
  status: IssueStatus;

  @Field(() => String)
  @Column('varchar')
  priority: IssuePriority;

  @Field(() => Float)
  @Column('double precision')
  listPosition: number;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  descriptionText: string | null;

  @Field(() => Int, { nullable: true })
  @Column('integer', { nullable: true })
  estimate: number | null;

  @Field(() => Int, { nullable: true })
  @Column('integer', { nullable: true })
  timeSpent: number | null;

  @Field(() => Int, { nullable: true })
  @Column('integer', { nullable: true })
  timeRemaining: number | null;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @Column('uuid')
  reporterId: string;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.issues)
  project: Project;

  @Field()
  @Column('integer')
  projectId: number;

  @Field(() => [Comment], { defaultValue: [] })
  @OneToMany(() => Comment, (comment) => comment.issue)
  comments: Comment[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.issues)
  @JoinTable()
  users: User[];

  @Field(() => [ID])
  @RelationId((issue: Issue) => issue.users)
  userIds: string[];

  @BeforeInsert()
  @BeforeUpdate()
  setDescriptionText = (): void => {
    if (this.description) {
      this.descriptionText = striptags(this.description);
    }
  };
}
