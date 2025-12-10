const request = require('supertest');
const app = require('../src/index');
const { initializeDatabase, seedDatabase } = require('../src/models/database');

describe('IoT Dashboard API', () => {
  let user1Token;
  let attackerToken;
  let adminToken;

  beforeAll(async () => {
    initializeDatabase();
    seedDatabase();

    const user1Login = await request(app)
      .post('/auth/login')
      .send({ email: 'user1@example.com', password: 'user123' });
    user1Token = user1Login.body.access_token;

    const attackerLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'attacker@example.com', password: 'attacker123' });
    attackerToken = attackerLogin.body.access_token;

    const adminLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    adminToken = adminLogin.body.access_token;
  });

  describe('Authentication', () => {
    test('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user1@example.com', password: 'user123' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
    });

    test('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user1@example.com', password: 'wrongpassword' });
      
      expect(res.status).toBe(401);
    });
  });

  describe('Device Authorization', () => {
    test('user can access own device', async () => {
      const res = await request(app)
        .get('/devices/2')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.owner_id).toBe(2);
    });

    test('user cannot access other user device', async () => {
      const res = await request(app)
        .get('/devices/2')
        .set('Authorization', `Bearer ${attackerToken}`);
      
      expect(res.status).toBe(403);
    });

    test('user cannot send command to other device', async () => {
      const res = await request(app)
        .post('/devices/2/command')
        .set('Authorization', `Bearer ${attackerToken}`)
        .send({ command: 'unlock' });
      
      expect(res.status).toBe(403);
    });

    test('admin can view any device', async () => {
      const res = await request(app)
        .get('/devices/2')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
    });

    test('user list only shows own devices', async () => {
      const res = await request(app)
        .get('/devices')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      res.body.forEach(device => {
        expect(device.owner_id).toBe(2);
      });
    });

    test('user can access own sensor data', async () => {
      const res = await request(app)
        .get('/devices/2/data')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('user cannot access other user sensor data', async () => {
      const res = await request(app)
        .get('/devices/2/data')
        .set('Authorization', `Bearer ${attackerToken}`);
      
      expect(res.status).toBe(403);
    });

    test('unauthenticated access denied', async () => {
      const res = await request(app).get('/devices/1');
      expect(res.status).toBe(401);
    });
  });
});
