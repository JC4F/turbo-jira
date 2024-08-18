import { Injectable } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { findEntityOrThrow, updateEntity } from '@/common';
import { Project } from '@/project/entities/project.entity';

@Injectable()
export class ProjectService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createProjectInput: CreateProjectInput) {
    return 'This action adds a new project';
  }

  async findAll() {
    return `This action returns all project`;
  }

  async findOne(id: number) {
    return await findEntityOrThrow(Project, id, {
      relations: ['issues', 'users'],
    });
  }

  async update(id: number, updateProjectInput: UpdateProjectInput) {
    return await updateEntity(Project, id, updateProjectInput);
  }

  async remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
