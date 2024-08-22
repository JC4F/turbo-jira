import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { createEntity } from '@/common';
import { User } from '@/user/entities/user.entity';
import { Role } from '@/constant';

@Injectable()
export class UserService {
  async create(createUserInput: CreateUserInput) {
    return await createEntity(User, { ...createUserInput, role: Role.USER });
  }

  async findOneByEmail(email: string) {
    return await User.createQueryBuilder('user')
      .select()
      .where('user.email = :email', { email })
      .getOneOrFail();
  }
}
