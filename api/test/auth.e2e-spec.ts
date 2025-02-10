import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - should login successfully', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200)
      .expect(res => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.user).toBeDefined();
      });
  });

  it('/auth/login (POST) - should fail with invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
}); 