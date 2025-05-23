import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';
import { clearDatabase } from '../lib/utils/testDeleteUtils';
describe('인증 API 테스트', () => {
  beforeEach(async () => {
    await clearDatabase(prismaClient);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const registerResponse = await request(app).post('/auth/register').send({
        email: 'test@example.com',
        password: 'password',
        nickname: 'Test User',
      });
    });
    test('올바른 이메일과 비밀번호', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password',
      });

      expect(response.status).toBe(200);
      expect(response.header['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access-token='),
          expect.stringContaining('refresh-token='),
        ]),
      );
    });
  });
});
