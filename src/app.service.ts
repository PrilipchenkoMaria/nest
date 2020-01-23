import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { fromEvent, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({ scope: Scope.REQUEST })
export class AppService {
  constructor(
    @Inject(REQUEST) private readonly request,
  ) {}

  /**
   * Return observable that will emit with given interval until request closed
   */
  getRequestInterval(period: number) {
    return interval(period)
      .pipe(takeUntil(fromEvent(this.request, 'close')));
  }
}
