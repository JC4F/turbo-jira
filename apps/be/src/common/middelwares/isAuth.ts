import { InvalidTokenError } from '@/common/errors';
import { getAuthTokenFromRequest, verifyToken } from '@/common/utils';
import { User } from '@/user/entities/user.entity';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const IsAuth: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const context = ctx.context;
  const token = getAuthTokenFromRequest(context.req);
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
  context.req.user = user;
  return next();
};
