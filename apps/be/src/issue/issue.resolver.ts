import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { IssueService } from './issue.service';
import { Issue } from './entities/issue.entity';
import { CreateIssueInput } from './dto/create-issue.input';
import { UpdateIssueInput } from './dto/update-issue.input';
import { Auth, AuthUser } from '@/common';
import { User } from '@/user/entities/user.entity';
import { Role } from '@/constant';

@Resolver(() => Issue)
export class IssueResolver {
  constructor(private readonly issueService: IssueService) {}

  @Auth([Role.ADMIN, Role.USER])
  @Query(() => [Issue])
  async getProjectIssues(
    @AuthUser() user: User,
    @Args('searchTerm', { type: () => String, nullable: true })
    searchTerm: string | null,
  ): Promise<Issue[]> {
    const { projectId } = user;

    return this.issueService.getProjectIssues(projectId, searchTerm);
  }

  @Auth([Role.ADMIN, Role.USER])
  @Query(() => Issue)
  async getIssueWithUsersAndComments(
    @Args('issueId', { type: () => String }) issueId: string,
  ): Promise<Issue> {
    return await this.issueService.getIssueWithUsersAndComments(issueId);
  }

  @Auth([Role.ADMIN, Role.USER])
  @Mutation(() => Issue)
  async createIssue(
    @Args('createIssueInput') createIssueInput: CreateIssueInput,
  ) {
    return await this.issueService.create(createIssueInput);
  }

  @Auth([Role.ADMIN, Role.USER])
  @Mutation(() => Issue)
  async updateIssue(
    @Args('updateIssueInput') updateIssueInput: UpdateIssueInput,
    @Args('id') issueId: string,
  ) {
    return await this.issueService.update(issueId, updateIssueInput);
  }

  @Auth([Role.ADMIN, Role.USER])
  @Mutation(() => Issue)
  async removeIssue(@Args('id', { type: () => String }) id: string) {
    return await this.issueService.remove(id);
  }
}
