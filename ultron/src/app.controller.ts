import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('health')
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ultron-api',
    };
  }

  @Get()
  getRoot() {
    return {
      message: 'Ultron API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
