import { InputType, Field } from '@nestjs/graphql';

import { ProjectCategory } from '@/constant';
import { Project } from '@/project/entities/project.entity';

@InputType()
export class CreateProjectInput implements Partial<Project> {
  @Field({ nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  url: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  category: ProjectCategory;
}
