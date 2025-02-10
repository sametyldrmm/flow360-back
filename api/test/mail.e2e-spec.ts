import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MailController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/mail/refresh-token (GET)', () => {
    return request(app.getHttpServer())
      .get('/mail/refresh-token')
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBeDefined();
        expect(res.body.data).toBeDefined();
        expect(res.body.data.accessToken).toBeDefined();
      });
  });

  it('/mail/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/mail/test')
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBeDefined();
        expect(res.body.message).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
}); 