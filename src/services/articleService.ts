import NotFoundError from '../lib/errors/NotFoundError';
import BadRequestError from '../lib/errors/BadRequestError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { articleRepository } from '../repositories/articleRepository';

export const articleService = {
  async createArticle(title: string, content: string, userId: number) {
    return articleRepository.createArticle(title, content, userId);
  },

  async getArticleList(page: number, pageSize: number, orderBy: string, keyword?: string) {
    const { articles, totalCount } = await articleRepository.getArticleList(
      page,
      pageSize,
      orderBy,
      keyword,
    );

    return {
      list: articles.map((article) => ({
        ...article,
        likes: undefined,
        likeCount: article.likes.length,
      })),
      totalCount,
    };
  },

  async getArticleById(id: number) {
    const article = await articleRepository.getArticleById(id);
    if (!article) throw new NotFoundError('article', id);

    return {
      ...article,
      likes: undefined,
      likeCount: article.likes.length,
    };
  },

  async updateArticle(id: number, userId: number, data: { title?: string; content?: string }) {
    const article = await articleRepository.getArticleById(id);
    if (!article) throw new NotFoundError('article', id);
    if (article.userId !== userId)
      throw new ForbiddenError('You are not the owner of this article.');

    return articleRepository.updateArticle(id, data);
  },

  async deleteArticle(id: number, userId: number) {
    const article = await articleRepository.getArticleById(id);
    if (!article) throw new NotFoundError('article', id);
    if (article.userId !== userId)
      throw new ForbiddenError('You are not the owner of this article.');

    return articleRepository.deleteArticle(id);
  },

  async createComment(articleId: number, content: string, userId: number) {
    const article = await articleRepository.getArticleById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    return articleRepository.createComment(articleId, content, userId);
  },

  async getComments(articleId: number, cursor?: number, limit: number = 10) {
    const article = await articleRepository.getArticleById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    return articleRepository.getComments(articleId, cursor, limit);
  },

  async likeArticle(articleId: number, userId: number) {
    const article = await articleRepository.getArticleById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    const existingLike = await articleRepository.checkIfLiked(articleId, userId);
    if (existingLike) throw new BadRequestError('Already liked');

    return articleRepository.likeArticle(articleId, userId);
  },

  async unlikeArticle(articleId: number, userId: number) {
    const article = await articleRepository.getArticleById(articleId);
    if (!article) throw new NotFoundError('article', articleId);

    const existingLike = await articleRepository.checkIfLiked(articleId, userId);
    if (!existingLike) throw new BadRequestError('Not liked');

    return articleRepository.unlikeArticle(articleId, userId);
  },
};
