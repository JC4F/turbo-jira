import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project } from './entities/project.entity';
import { UpdateProjectInput } from './dto/update-project.input';
import { Auth, AuthUser } from '@/common/decorators';
import { User } from '@/user/entities/user.entity';
import { Role } from '@/constant';
import { ResolveTimeInterceptor } from '@/common';
import { UseInterceptors } from '@nestjs/common';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @UseInterceptors(ResolveTimeInterceptor)
  @Auth([Role.ADMIN, Role.USER])
  @Query(() => Project)
  async getProjectWithUsersAndIssues(@AuthUser() authUser: User) {
    return await this.projectService.findOne(authUser.projectId);
  }

  @Auth([Role.ADMIN, Role.USER])
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
}
