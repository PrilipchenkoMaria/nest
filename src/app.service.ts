import { HttpService, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { fromEvent, Observable, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  constructor(
    @Inject(REQUEST) private readonly request,
    private readonly http: HttpService,
  ) {}

  /**
   * Return observable that will emit with given interval until request closed
   */
  getRequestInterval(period: number): Observable<number> {
    return timer(0, period)
      .pipe(takeUntil(fromEvent(this.request, 'close')));
  }

  getWeather(params: GetWeatherParams) {
    return this.http.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        ...params,
        APPID: process.env.API_KEY,
      },
    }).pipe(map(res => res.data));
  }
}

interface GetWeatherParams {
  lat: string;
  lon: string;
}
