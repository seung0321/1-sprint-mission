import { prismaClient } from '../lib/prismaClient';

export const articleRepository = {
  async createArticle(title: string, content: string, userId: number) {
    return prismaClient.article.create({
      data: { title, content, userId },
    });
  },

  async getArticleList(page: number, pageSize: number, orderBy: string, keyword?: string) {
    const where = keyword ? { title: { contains: keyword } } : {};
    const totalCount = await prismaClient.article.count({ where });

    const articles = await prismaClient.article.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
      include: { likes: true },
    });

    return { articles, totalCount };
  },

  async getArticleById(id: number) {
    return prismaClient.article.findUnique({
      where: { id },
      include: { likes: true },
    });
  },

  async updateArticle(id: number, data: { title?: string; content?: string }) {
    return prismaClient.article.update({ where: { id }, data });
  },

  async deleteArticle(id: number) {
    return prismaClient.article.delete({ where: { id } });
  },

  async createComment(articleId: number, content: string, userId: number) {
    return prismaClient.comment.create({
      data: { articleId, content, userId },
    });
  },

  async getComments(articleId: number, cursor?: number, limit: number = 10) {
    const comments = await prismaClient.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    return {
      list: comments.slice(0, limit),
      nextCursor: comments.length > limit ? comments[limit].id : null,
    };
  },

  async likeArticle(articleId: number, userId: number) {
    return prismaClient.like.create({
      data: { articleId, userId },
    });
  },

  async unlikeArticle(articleId: number, userId: number) {
    return prismaClient.like.deleteMany({
      where: { articleId, userId },
    });
  },

  async checkIfLiked(articleId: number, userId: number) {
    return prismaClient.like.findFirst({
      where: { articleId, userId },
    });
  },
};
