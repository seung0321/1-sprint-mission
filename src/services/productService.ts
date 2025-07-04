import { productRepository } from '../repositories/productRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import { notificationService } from './notificationService';
import { NotificationType } from '@prisma/client';
import { io, userSockets } from './socketService';

export const productService = {
  createProduct: async (data: any, userId: number) => {
    return productRepository.createProduct({ ...data, userId });
  },

  getProduct: async (id: number, userId?: number) => {
    const product = await productRepository.findProductById(id);
    if (!product) throw new NotFoundError('product', id);

    return {
      ...product,
      favorites: undefined,
      favoriteCount: product.favorites.length,
      isFavorited: userId ? product.favorites.some((fav) => fav.userId === userId) : undefined,
    };
  },

  updateProduct: async (id: number, data: any, userId: number) => {
    const existingProduct = await productRepository.findProductById(id);
    if (!existingProduct) throw new NotFoundError('product', id);
    if (existingProduct.userId !== userId)
      throw new ForbiddenError('You are not the owner of this product');

    const oldPrice = existingProduct.price;
    const newPrice = data.price;

    const updatedProduct = await productRepository.updateProduct(id, data);

    if (newPrice !== undefined && oldPrice !== newPrice) {
      const favoritedUsers = existingProduct.favorites.map((f) => f.userId);

      const payload = {
        productId: id,
        oldPrice,
        newPrice,
      };

      await Promise.all(
        favoritedUsers.map(async (userId) => {
          await notificationService.createNotification({
            userId,
            type: NotificationType.PRICE_FLUCTUATION,
            payload,
          });

          const targetSocketId = userSockets.get(userId);
          if (targetSocketId) {
            io.to(targetSocketId).emit('notification', {
              type: NotificationType.PRICE_FLUCTUATION,
              payload,
            });
          }
        }),
      );
    }

    return updatedProduct;
  },

  deleteProduct: async (id: number, userId: number) => {
    const existingProduct = await productRepository.findProductById(id);
    if (!existingProduct) throw new NotFoundError('product', id);
    if (existingProduct.userId !== userId)
      throw new ForbiddenError('You are not the owner of this product');

    await productRepository.deleteProduct(id);
  },

  getProductList: async (page: number, pageSize: number, orderBy: string, keyword?: string) => {
    const where = keyword
      ? { OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }] }
      : undefined;
    const totalCount = await productRepository.countProducts(where);
    const products = await productRepository.findProducts(
      (page - 1) * pageSize,
      pageSize,
      orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
    );

    return {
      list: products.map((p) => ({
        ...p,
        favorites: undefined,
        favoriteCount: p.favorites.length,
        isFavorited: undefined,
      })),
      totalCount,
    };
  },

  createComment: async (productId: number, content: string, userId: number) => {
    const product = await productRepository.findProductById(productId);
    if (!product) throw new NotFoundError('product', productId);

    return productRepository.createComment(productId, content, userId);
  },

  getComments: async (productId: number, cursor?: number, limit?: number) => {
    const product = await productRepository.findProductById(productId);
    if (!product) throw new NotFoundError('product', productId);

    const comments = await productRepository.findCommentsByProductId(productId, cursor, limit);
    return {
      list: comments.slice(0, limit),
      nextCursor: comments.length > (limit || 0) ? comments[limit!].id : null,
    };
  },

  addFavorite: async (productId: number, userId: number) => {
    const existingFavorite = await productRepository.findFavorite(productId, userId);
    if (existingFavorite) throw new BadRequestError('Already favorited');

    return productRepository.addFavorite(productId, userId);
  },

  removeFavorite: async (productId: number, userId: number) => {
    const existingFavorite = await productRepository.findFavorite(productId, userId);
    if (!existingFavorite) throw new BadRequestError('Not favorited');

    return productRepository.removeFavorite(existingFavorite.id);
  },
};
