import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResolveTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const start = Date.now();
    const info = gqlContext.getInfo();
    const resolveTime = Date.now() - start;

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`,
          ),
        ),
      );
  }
}
