import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { UpdateProjectInput } from './dto/update-project.input';
import { AuthUser } from '@/common/decorators';
import { User } from '@/user/entities/user.entity';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  // @Mutation(() => Project)
  // async createProject(
  //   @Args('createProjectInput') createProjectInput: CreateProjectInput,
  // ) {
  //   return await this.projectService.create(createProjectInput);
  // }

  @Query(() => Project)
  async getProjectWithUsersAndIssues(@AuthUser() authUser: User) {
    return await this.projectService.findOne(authUser.projectId);
  }

  @Mutation(() => Project)
  async updateProject(
    @AuthUser() authUser: User,
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return await this.projectService.update(
      authUser.projectId,
      updateProjectInput,
    );
  }

  // @Mutation(() => Project)
  // async removeProject(@Args('id', { type: () => Int }) id: number) {
  //   return await this.projectService.remove(id);
  // }
}
