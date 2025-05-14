import { prismaClient } from '../lib/prismaClient';

export const productRepository = {
  createProduct: (data: any) => prismaClient.product.create({ data }),

  findProductById: (id: number) =>
    prismaClient.product.findUnique({ where: { id }, include: { favorites: true } }),

  updateProduct: (id: number, data: any) => prismaClient.product.update({ where: { id }, data }),

  deleteProduct: (id: number) => prismaClient.product.delete({ where: { id } }),

  countProducts: (where: any) => prismaClient.product.count({ where }),

  findProducts: (skip: number, take: number, orderBy: any, where: any) =>
    prismaClient.product.findMany({ skip, take, orderBy, where, include: { favorites: true } }),

  createComment: (productId: number, content: string, userId: number) =>
    prismaClient.comment.create({ data: { productId, content, userId } }),

  findCommentsByProductId: (productId: number, cursor?: number, limit?: number) =>
    prismaClient.comment.findMany({
      where: { productId },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit ? limit + 1 : undefined,
    }),

  findFavorite: (productId: number, userId: number) =>
    prismaClient.favorite.findFirst({ where: { productId, userId } }),

  addFavorite: (productId: number, userId: number) =>
    prismaClient.favorite.create({ data: { productId, userId } }),

  removeFavorite: (favoriteId: number) =>
    prismaClient.favorite.delete({ where: { id: favoriteId } }),
};
