import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { createEntity, findEntityOrThrow } from '@/common';
import { User } from '@/user/entities/user.entity';
import { Role } from '@/constant';

@Injectable()
export class UserService {
  async create(createUserInput: CreateUserInput) {
    return await createEntity(User, { ...createUserInput, role: Role.USER });
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return await findEntityOrThrow(User, id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
