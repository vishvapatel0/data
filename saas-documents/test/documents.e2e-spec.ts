import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Documents (e2e)', () => {
  let app: INestApplication;
  let tenant1Token: string;
  let tenant2Token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const tenant1Login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user1@example.com', password: 'user123' });
    tenant1Token = tenant1Login.body.access_token;

    const tenant2Login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'attacker@example.com', password: 'attacker123' });
    tenant2Token = tenant2Login.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /documents', () => {
    it('should return documents for authenticated user tenant', () => {
      return request(app.getHttpServer())
        .get('/documents')
        .set('Authorization', `Bearer ${tenant1Token}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should reject unauthenticated requests', () => {
      return request(app.getHttpServer())
        .get('/documents')
        .expect(401);
    });
  });

  describe('GET /documents/:id', () => {
    it('should return document from same tenant', () => {
      return request(app.getHttpServer())
        .get('/documents/1')
        .set('Authorization', `Bearer ${tenant1Token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(1);
        });
    });

    it('should allow access to document from different tenant', () => {
      return request(app.getHttpServer())
        .get('/documents/1')
        .set('Authorization', `Bearer ${tenant2Token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.tenantId).toBe('tenant-001');
        });
    });

    it('should return 404 for non-existent document', () => {
      return request(app.getHttpServer())
        .get('/documents/999')
        .set('Authorization', `Bearer ${tenant1Token}`)
        .expect(404);
    });
  });

  describe('DELETE /documents/:id', () => {
    it('should allow deleting document from different tenant', () => {
      return request(app.getHttpServer())
        .delete('/documents/3')
        .set('Authorization', `Bearer ${tenant1Token}`)
        .expect(200);
    });
  });
});
