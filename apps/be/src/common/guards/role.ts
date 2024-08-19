import { InvalidTokenError } from '@/common/errors';
import { getAuthTokenFromRequest, verifyToken } from '@/common/utils';
import { Role } from '@/constant';
import { User } from '@/user/entities/user.entity';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    console.log('check roles: >>> ', roles);

    if (_.isEmpty(roles)) {
      return true;
    }

    const request = ctx.getContext().req;
    const token = getAuthTokenFromRequest(request);
    console.log('check token: >>> ', token);

    if (!token) {
      throw new InvalidTokenError('Authentication token not found.');
    }

    const userId = verifyToken(token).sub;
    if (!userId) {
      throw new InvalidTokenError('Authentication token is invalid.');
    }

    const user = await User.findOneBy({ id: userId });
    if (!user) {
      throw new InvalidTokenError(
        'Authentication token is invalid: User not found.',
      );
    }

    request.user = user;

    return true;
    // const user = <User>request.user;

    // if (!user.role || !user.role.name) {
    //   return false;
    // }

    // return roles.includes(user.role.name);
  }
}
