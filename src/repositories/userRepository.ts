import { prismaClient } from '../lib/prismaClient';
import { User } from '@prisma/client';

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
};
