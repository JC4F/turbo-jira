import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { ApiConfigService } from '@/shared/services';
import { SharedModule } from '@/shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const apiConfigService = app.select(SharedModule).get(ApiConfigService);

  await app.listen(apiConfigService.port || 3000);
}
bootstrap();
