const request = require('supertest');
const app = require('../src/app');
const { prisma } = require('../src/config/env');

describe('MedSecure QR Backend API Integration Tests', () => {
  let userToken = '';
  let adminToken = '';
  let testUserTokenQR = '';

  beforeAll(async () => {
    // Ensure clean state for test email if exists
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['test.patient@example.com', 'admin.test@example.com'],
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['test.patient@example.com', 'admin.test@example.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('1. Authentication Tests', () => {
    it('should register a new patient user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Patient',
          email: 'test.patient@example.com',
          mobile: '+1-555-111-2222',
          password: 'Password@123',
          confirmPassword: 'Password@123',
          dateOfBirth: '1992-05-10',
          gender: 'Female',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      userToken = res.body.token;
    });

    it('should fail registration with mismatched passwords', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Fail User',
          email: 'fail@example.com',
          mobile: '+1-555-000-0000',
          password: 'Password@123',
          confirmPassword: 'MismatchPassword@123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });

    it('should login patient user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.patient@example.com',
          password: 'Password@123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });
  });

  describe('2. Medical Profile & QR Generation Tests', () => {
    it('should create patient medical profile and generate active QR token', async () => {
      const res = await request(app)
        .post('/api/medical-profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          bloodGroup: 'B+',
          rhFactor: 'Positive',
          address: '123 Test St, San Francisco, CA',
          allergies: 'Aspirin',
          medicalConditions: 'Mild Hypertension',
          emergencyContactName: 'Mark Patient',
          emergencyContactNumber: '+1-555-333-4444',
          emergencyContactRelationship: 'Spouse',
          consentAccepted: true,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.bloodGroup).toEqual('B+');
      expect(res.body.qrProfile).toBeDefined();
      expect(res.body.qrProfile.secureToken).toBeDefined();

      testUserTokenQR = res.body.qrProfile.secureToken;
    });

    it('should fetch patient own medical profile', async () => {
      const res = await request(app)
        .get('/api/medical-profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.allergies).toEqual('Aspirin');
    });
  });

  describe('3. Public Emergency QR Scan Resolution Tests', () => {
    it('should return sanitized emergency summary given valid QR token', async () => {
      const res = await request(app).get(`/api/public/medical/${testUserTokenQR}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.emergencySummary.bloodGroup).toEqual('B+');
      expect(res.body.data.emergencySummary.allergies).toEqual('Aspirin');
      expect(res.body.data.patient.name).toEqual('Test Patient');
      // Passwords or tokens should NOT be present in public response
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('should return 404 for non-existent QR token', async () => {
      const res = await request(app).get('/api/public/medical/invalid_token_xyz_999');

      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('4. Authorization & Admin Security Tests', () => {
    it('should block normal patient user from accessing admin dashboard', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
});
