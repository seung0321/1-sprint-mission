import { prismaClient } from '../prismaClient';

export async function createTestUser(overrides = {}) {
  return await prismaClient.user.create({
    data: {
      email: 'test@example.com',
      password: 'password',
      nickname: 'test User',
      ...overrides,
    },
  });
}

export async function createTestArticle(userId: number, overrides = {}) {
  return await prismaClient.article.create({
    data: {
      title: '테스트 Article',
      content: '이것은 테스트 Article 내용입니다.',
      image: 'image1.png',
      userId,
      ...overrides,
    },
  });
}
