import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from 'src/shared/services';

@Global()
@Module({
  controllers: [],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class SharedModule {}
