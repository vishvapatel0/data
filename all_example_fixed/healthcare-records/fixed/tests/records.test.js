const request = require('supertest');
const app = require('../src/index');
const { db, initializeDatabase, seedDatabase } = require('../src/models/database');

describe('Healthcare Records API', () => {
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

  describe('Medical Records Access', () => {
    test('user can access their own records', async () => {
      const res = await request(app)
        .get('/records/1')
        .set('Authorization', `Bearer ${user1Token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.patient_id).toBe(2);
    });

    test('user cannot access other patient records', async () => {
      const res = await request(app)
        .get('/records/1')
        .set('Authorization', `Bearer ${attackerToken}`);
      
      expect(res.status).toBe(403);
    });

    test('user cannot update other patient records', async () => {
      const res = await request(app)
        .put('/records/1')
        .set('Authorization', `Bearer ${attackerToken}`)
        .send({ notes: 'Modified by attacker' });
      
      expect(res.status).toBe(403);
    });

    test('admin can view any records', async () => {
      const res = await request(app)
        .get('/records/1')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
    });

    test('unauthenticated requests are denied', async () => {
      const res = await request(app).get('/records/1');
      expect(res.status).toBe(401);
    });
  });
});
