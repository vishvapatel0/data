const request = require('supertest');
const app = require('../src/index');

describe('Lab Results API', () => {
  let adminToken;
  let userToken;
  let attackerToken;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    adminToken = adminLogin.body.access_token;

    const userLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'user1@example.com', password: 'user123' });
    userToken = userLogin.body.access_token;

    const attackerLogin = await request(app)
      .post('/auth/login')
      .send({ email: 'attacker@example.com', password: 'attacker123' });
    attackerToken = attackerLogin.body.access_token;
  });

  describe('GET /results', () => {
    it('should return all lab results for authenticated user', async () => {
      const res = await request(app)
        .get('/results')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return all results including sensitive data for any staff', async () => {
      const res = await request(app)
        .get('/results')
        .set('Authorization', `Bearer ${attackerToken}`);

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('ssn');
      expect(res.body[0]).toHaveProperty('diagnosis');
      expect(res.body[0]).toHaveProperty('confidential_notes');
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app).get('/results');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /results/:id', () => {
    it('should return specific lab result', async () => {
      const res = await request(app)
        .get('/results/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
    });

    it('should allow any staff to view any patient result', async () => {
      const res = await request(app)
        .get('/results/1')
        .set('Authorization', `Bearer ${attackerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('confidential_notes');
      expect(res.body).toHaveProperty('ssn');
    });

    it('should return 404 for non-existent result', async () => {
      const res = await request(app)
        .get('/results/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /results/patient/:patientId', () => {
    it('should return patient results with sensitive data', async () => {
      const res = await request(app)
        .get('/results/patient/1')
        .set('Authorization', `Bearer ${attackerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.patient).toHaveProperty('ssn');
      expect(res.body.results.length).toBeGreaterThan(0);
    });
  });
});
