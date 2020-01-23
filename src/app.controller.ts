import { Controller, Get, Query, Response } from '@nestjs/common';
import { map, switchMap } from 'rxjs/operators';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('weather')
  streamWeather(
    @Query() params,
    @Response() res,
  ) {
    this.appService
      .getRequestInterval(6e5)
      .pipe(
        switchMap(() => this.appService.getWeather(params)),
        map(JSON.stringify as () => string),
      )
      .subscribe(i => res.write(`${i}\n`));
  }
}
