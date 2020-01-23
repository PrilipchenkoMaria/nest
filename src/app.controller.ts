import { Controller, Get, Query, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('weather')
  streamWeather(
    @Query() params: string[],
    @Response() res,
  ): void {
    this.appService
      .getRequestInterval(1e3)
      .subscribe(i => res.write(`${i}\n`));
  }
}
