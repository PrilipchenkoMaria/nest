import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it.skip('/api/weather (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/weather')
      .expect(200)
      .buffer()
      .parse((res, cb) => res.once('data', chunk => {
        res.pause();
        res.removeAllListeners();
        expect(chunk.toString()).toBe('0\n');
        cb(null, null);
      }))
      .end();
  });
});
