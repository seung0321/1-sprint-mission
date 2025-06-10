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

export async function createTestProduct(userId: number, overrides = {}) {
  return await prismaClient.product.create({
    data: {
      name: '테스트 Product',
      description: '이것은 테스트 Product 설명입니다.',
      price: 10000,
      tags: ['태그'],
      images: ['image1.png'],
      userId,
      ...overrides,
    },
  });
}
