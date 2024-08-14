import { ApiConfigService } from '@/shared/services';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private apiConfigService: ApiConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('env')
  getEnv() {
    return this.apiConfigService.port;
  }
}
