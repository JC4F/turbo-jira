import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueResolver } from './issue.resolver';
import { Issue } from '@/issue/entities/issue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  providers: [IssueResolver, IssueService],
})
export class IssueModule {}
