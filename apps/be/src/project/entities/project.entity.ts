import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import is from '@/common/utils/validations';
import { ProjectCategory } from '@/constant';
import { Issue } from '@/issue/entities/issue.entity';
import { User } from '@/user/entities/user.entity';

@ObjectType()
@Entity()
export class Project extends BaseEntity {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    url: is.url(),
    category: [is.required(), is.oneOf(Object.values(ProjectCategory))],
  };

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar')
  name: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  url: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  description: string | null;

  @Field(() => String)
  @Column('varchar')
  category: ProjectCategory;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field(() => [Issue], { defaultValue: [] })
  @OneToMany(() => Issue, (issue) => issue.project)
  issues: Issue[];

  @Field(() => [User], { defaultValue: [] })
  @OneToMany(() => User, (user) => user.project)
  users: User[];
}
