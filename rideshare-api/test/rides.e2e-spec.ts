import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Rides (e2e)', () => {
  let app: INestApplication;
  let user1Token: string;
  let attackerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const user1Login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user1@example.com', password: 'user123' });
    user1Token = user1Login.body.access_token;

    const attackerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'attacker@example.com', password: 'attacker123' });
    attackerToken = attackerLogin.body.access_token;

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    adminToken = adminLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user1@example.com', password: 'user123' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user1@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });
  });

  describe('Ride Authorization', () => {
    it('user can access own ride', async () => {
      const response = await request(app.getHttpServer())
        .get('/rides/1')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.passengerId).toBe(2);
    });

    it('user cannot access other user ride', async () => {
      const response = await request(app.getHttpServer())
        .get('/rides/1')
        .set('Authorization', `Bearer ${attackerToken}`);

      expect(response.status).toBe(403);
    });

    it('admin can access any ride', async () => {
      const response = await request(app.getHttpServer())
        .get('/rides/3')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('user list only shows own rides', async () => {
      const response = await request(app.getHttpServer())
        .get('/rides')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      response.body.forEach((ride: any) => {
        expect([ride.passengerId, ride.driverId]).toContain(2);
      });
    });

    it('unauthenticated access denied', async () => {
      const response = await request(app.getHttpServer())
        .get('/rides/1');

      expect(response.status).toBe(401);
    });
  });
});
