import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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
    @Args('issueId', { type: () => Int }) issueId: number,
  ): Promise<Issue> {
    return await this.issueService.getIssueWithUsersAndComments(issueId);
  }

  @Mutation(() => Issue)
  async createIssue(
    @Args('createIssueInput') createIssueInput: CreateIssueInput,
  ) {
    return await this.issueService.create(createIssueInput);
  }

  // @Query(() => [Issue], { name: 'issue' })
  // findAll() {
  //   return this.issueService.findAll();
  // }

  // @Query(() => Issue, { name: 'issue' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.issueService.findOne(id);
  // }

  @Mutation(() => Issue)
  async updateIssue(
    @Args('updateIssueInput') updateIssueInput: UpdateIssueInput,
    @Args('id') issueId: number,
  ) {
    return await this.issueService.update(issueId, updateIssueInput);
  }

  @Mutation(() => Issue)
  async removeIssue(@Args('id', { type: () => Int }) id: number) {
    return await this.issueService.remove(id);
  }
}
