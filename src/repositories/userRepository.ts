import { prismaClient } from '../lib/prismaClient';
import { User } from '@prisma/client';
import { NotificationType } from '@prisma/client';
export const userRepository = {
  async findById(userId: number): Promise<User | null> {
    return prismaClient.user.findUnique({ where: { id: userId } });
  },

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    return prismaClient.user.update({ where: { id: userId }, data });
  },

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  async getUserProducts(userId: number, where: any, skip: number, take: number, orderBy: any) {
    const totalCount = await prismaClient.product.count({ where: { ...where, userId } });
    const products = await prismaClient.product.findMany({
      skip,
      take,
      orderBy,
      where: { ...where, userId },
      include: { favorites: true },
    });
    return { products, totalCount };
  },

  async getUserFavoriteProducts(
    userId: number,
    where: any,
    skip: number,
    take: number,
    orderBy: any,
  ) {
    const totalCount = await prismaClient.product.count({
      where: {
        ...where,
        favorites: { some: { userId } },
      },
    });
    const products = await prismaClient.product.findMany({
      skip,
      take,
      orderBy,
      where: {
        ...where,
        favorites: { some: { userId } },
      },
      include: { favorites: true },
    });
    return { products, totalCount };
  },
  findNotifications: async (
    userId: number,
    params: {
      cursor: number;
      limit: number;
      keyword?: string;
      orderBy?: 'recent';
    },
  ) => {
    const { cursor, limit, keyword, orderBy } = params;

    const where = {
      userId,
      ...(keyword
        ? {
            OR: [
              {
                type: {
                  equals: keyword as NotificationType,
                },
              },
              {
                payload: {
                  path: ['message'], // JSON 검색 (예시)
                  string_contains: keyword,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const notifications = await prismaClient.notification.findMany({
      where,
      take: limit + 1, // 다음 페이지 확인용
      skip: cursor > 0 ? 1 : 0,
      ...(cursor > 0
        ? {
            cursor: { id: cursor },
          }
        : {}),
      orderBy: {
        createdAt: orderBy === 'recent' ? 'desc' : 'asc',
      },
    });

    const nextCursor = notifications.length > limit ? notifications[limit].id : null;

    if (notifications.length > limit) {
      notifications.pop(); // 다음 페이지 확인용으로 하나 빼줌
    }

    const unreadCount = await prismaClient.notification.count({
      where: { userId, is_read: false },
    });

    return {
      notifications,
      nextCursor,
      unreadCount,
    };
  },
};
