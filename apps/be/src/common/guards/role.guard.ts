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

    if (_.isEmpty(roles)) {
      return true;
    }

    const request = ctx.getContext().req;
    const user = <User>request.user;

    console.log('check user: >> ', user);

    if (!user.role) {
      return false;
    }

    return roles.includes(user.role);
  }
}
