import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Analytics (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('GET /api/analytics', () => {
    it('returns 401 when no Authorization header', () => {
      return request(app.getHttpServer())
        .get('/api/analytics')
        .expect(401);
    });

    it('returns 401 when invalid Bearer token', () => {
      return request(app.getHttpServer())
        .get('/api/analytics')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('POST /api/analytics/recompute', () => {
    it('returns 401 when no Authorization header', () => {
      return request(app.getHttpServer())
        .post('/api/analytics/recompute')
        .expect(401);
    });

    it('returns 401 when invalid Bearer token', () => {
      return request(app.getHttpServer())
        .post('/api/analytics/recompute')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
