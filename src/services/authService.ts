import bcrypt from 'bcrypt';
import { authRepository } from '../repositories/authRepository';
import { generateTokens, verifyRefreshToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV } from '../lib/constants';
import BadRequestError from '../lib/errors/BadRequestError';
import { Response } from 'express';

async function register(email: string, nickname: string, password: string) {
  const isExist = await authRepository.findUserByEmail(email);
  if (isExist) {
    throw new BadRequestError('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await authRepository.createUser(email, nickname, hashedPassword);
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function login(email: string, password: string, res: Response) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);
}

async function logout(res: Response) {
  clearTokenCookies(res);
}

async function refreshToken(cookies: any, res: Response) {
  const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { userId } = verifyRefreshToken(refreshToken);

  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new BadRequestError('Invalid refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(userId);
  setTokenCookies(res, accessToken, newRefreshToken);
}

function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/auth/refresh',
  });
}

function clearTokenCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

export const authService = {
  register,
  login,
  logout,
  refreshToken,
};
