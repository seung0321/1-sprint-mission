import request from 'supertest';
import app from '../main';
import { prismaClient } from '../lib/prismaClient';
import { clearDatabase } from '../lib/utils/testDeleteUtils';
import { registerAndLogin } from '../lib/utils/testAuthUtils';
import bcrypt from 'bcrypt';

describe('인증 API 테스트', () => {
  beforeEach(async () => {
    await clearDatabase(prismaClient);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  describe('POST /auth/register', () => {
    test('중복된 이메일로 회원가입 시 400을 반환한다.', async () => {
      await prismaClient.user.create({
        data: {
          email: 'test@example.com',
          password: bcrypt.hashSync('password', 10),
          nickname: 'test User',
        },
      });

      const registerData = {
        email: 'test@example.com',
        nickname: 'test User',
        password: 'password',
      };
      const response = await request(app).post('/auth/register').send(registerData);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
    test('회원가입 시 201을 반환한다.', async () => {
      const registerData = {
        email: 'test@example.com',
        nickname: 'test User',
        password: 'password',
      };
      const response = await request(app).post('/auth/register').send(registerData);
      expect(response.status).toBe(201);
      expect(response.body.email).toBe(registerData.email);
    });
  });
  describe('POST /auth/login', () => {
    beforeEach(async () => {});
    test('잘못된 아이디 또는 비밀번호로 로그인 시 400을 반환한다', async () => {
      await prismaClient.user.create({
        data: {
          email: 'test@example.com',
          password: bcrypt.hashSync('password', 10),
          nickname: 'test User',
        },
      });

      const incorrectEmailData = {
        email: 'not-email',
        password: 'password',
      };
      const emailResponse = await request(app).post('/auth/login').send(incorrectEmailData);
      expect(emailResponse.status).toBe(400);
      expect(emailResponse.body.message).toBe('Invalid credentials');

      const incorrectPasswordData = {
        email: 'test@example.com',
        password: 'not-password',
      };
      const passwordResponse = await request(app).post('/auth/login').send(incorrectPasswordData);
      expect(passwordResponse.status).toBe(400);
      expect(passwordResponse.body.message).toBe('Invalid credentials');
    });
    test('올바른 이메일과 비밀번호로 로그인 시 200을 반환한다', async () => {
      const { login } = await registerAndLogin();

      expect(login.status).toBe(200);
      expect(login.header['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access-token='),
          expect.stringContaining('refresh-token='),
        ]),
      );
    });
  });
  describe('POST /auth/logout', () => {
    test('로그아웃 성공 시 204를 반환한다', async () => {
      const { agent, login } = await registerAndLogin();

      expect(login.status).toBe(200);

      const logoutResponse = await agent.post('/auth/logout');
      expect(logoutResponse.status).toBe(204);
    });
  });
  describe('POST /auth/refresh', () => {
    test('잘못된 refresh 토큰을 입력 시 400을 반환한다', async () => {
      const refresh = await request(app).post('/auth/refresh').send('refresh-token=123');

      expect(refresh.status).toBe(400);
      expect(refresh.body.message).toBe('Invalid refresh token');
    });
    test('토큰 재갱신 성공 시 200을 반환한다 ', async () => {
      const { agent } = await registerAndLogin();

      const refreshResponse = await agent.post('/auth/refresh');

      expect(refreshResponse.status).toBe(200);

      const setCookie = refreshResponse.headers['set-cookie'];
      const cookieArray = Array.isArray(setCookie) ? setCookie : setCookie.split(',');

      const accessToken = cookieArray.find((c) => c.trim().startsWith('access-token='));
      const refreshToken = cookieArray.find((c) => c.trim().startsWith('refresh-token='));

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });
  });
});
