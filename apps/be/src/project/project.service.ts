import { Injectable } from '@nestjs/common';
import { UpdateProjectInput } from './dto/update-project.input';
import { findEntityOrThrow, updateEntity } from '@/common';
import { Project } from '@/project/entities/project.entity';

@Injectable()
export class ProjectService {
  async findOne(id: string) {
    return await findEntityOrThrow(Project, id, {
      relations: ['issues', 'users'],
    });
  }

  async update(id: string, updateProjectInput: UpdateProjectInput) {
    return await updateEntity(Project, id, updateProjectInput);
  }
}
