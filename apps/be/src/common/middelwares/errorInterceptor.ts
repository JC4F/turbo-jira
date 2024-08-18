import { CustomError } from '@/common/errors';
import { pick } from '@/common/utils';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const ErrorInterceptor: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  // const context = ctx.context;
  try {
    return await next();
  } catch (error) {
    console.error(error);
    const isErrorSafeForClient = error instanceof CustomError;

    if (isErrorSafeForClient) {
      const { code, message, data, status } = pick(
        error as InstanceType<typeof CustomError>,
        ['message', 'code', 'status', 'data'],
      );

      throw new CustomError(message, code, status, data);
    }

    throw new CustomError(
      'Something went wrong, please contact our support.',
      'INTERNAL_ERROR',
      500,
      {},
    );
  }
};
