import { Injectable } from '@nestjs/common';
import { CreateIssueInput } from './dto/create-issue.input';
import { UpdateIssueInput } from './dto/update-issue.input';
import { Issue } from '@/issue/entities/issue.entity';
import {
  createEntity,
  deleteEntity,
  findEntityOrThrow,
  updateEntity,
} from '@/common';

@Injectable()
export class IssueService {
  async calculateListPosition({
    projectId,
    status,
  }: Partial<Issue>): Promise<number> {
    const issues = await Issue.find({ where: { projectId, status } });

    const listPositions = issues.map(({ listPosition }) => listPosition);

    if (listPositions.length > 0) {
      return Math.min(...listPositions) - 1;
    }
    return 1;
  }

  async getProjectIssues(projectId: string, searchTerm: string) {
    let whereSQL = 'issue.projectId = :projectId';

    if (searchTerm) {
      whereSQL +=
        ' AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)';
    }

    const issues = await Issue.createQueryBuilder('issue')
      .select()
      .where(whereSQL, { projectId, searchTerm: `%${searchTerm}%` })
      .getMany();

    return issues;
  }

  async getIssueWithUsersAndComments(issueId: string) {
    const issue = await findEntityOrThrow(Issue, issueId, {
      relations: ['users', 'comments', 'comments.user'],
    });

    return issue;
  }

  async create(createIssueInput: CreateIssueInput) {
    const listPosition = await this.calculateListPosition(createIssueInput);
    const issue = await createEntity(Issue, {
      ...createIssueInput,
      listPosition,
    });
    return issue;
  }

  async update(id: string, updateIssueInput: UpdateIssueInput) {
    const issue = await updateEntity(Issue, id, updateIssueInput);
    return issue;
  }

  async remove(id: string) {
    await deleteEntity(Issue, id);
    return true;
  }
}
