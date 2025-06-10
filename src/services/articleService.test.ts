import { articleService } from './articleService';
import { articleRepository } from '../repositories/articleRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';

jest.mock('../repositories/articleRepository');
jest.mock('./notificationService');
jest.mock('./socketService', () => ({
  io: { to: jest.fn().mockReturnThis(), emit: jest.fn() },
  userSockets: new Map<number, string>(),
}));

describe('게시글 서비스', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    image: 'img.jpg',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: [],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    test('게시글을 생성 할 수 있다', async () => {
      jest.spyOn(articleRepository, 'createArticle').mockResolvedValue(mockArticle);

      const result = await articleService.createArticle(
        mockArticle.title,
        mockArticle.content,
        mockArticle.userId,
      );

      expect(articleRepository.createArticle).toHaveBeenCalled();
      expect(result).toEqual(mockArticle);
    });
  });

  describe('getArticleById', () => {
    test('게시글의 아이디가 존재하지 않으면 NotFoundError를 발생시켜야 한다', async () => {
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue(null);

      await expect(articleService.getArticleById(999)).rejects.toThrow(NotFoundError);
    });

    test('게시글의 아이디로 정보를 조회한다', async () => {
      const getArticle = {
        ...mockArticle,
        likes: [{ id: 1, articleId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() }],
      };
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue(getArticle);

      const result = await articleService.getArticleById(getArticle.id);

      expect(result).toEqual({
        ...getArticle,
        likes: undefined,
        likeCount: getArticle.likes.length,
      });
    });
  });

  describe('getArticleList', () => {
    test('게시글 목록을 조회한다', async () => {
      const articles = [
        {
          ...mockArticle,
          likes: [{ id: 1, articleId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() }],
        },
      ];
      jest.spyOn(articleRepository, 'getArticleList').mockResolvedValue({
        articles,
        totalCount: 1,
      });

      const result = await articleService.getArticleList(1, 10, 'recent');

      expect(result).toEqual({
        list: [
          {
            ...articles[0],
            likes: undefined,
            likeCount: 1,
          },
        ],
        totalCount: 1,
      });
    });
  });

  describe('updateArticle', () => {
    const updatedData = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    test('게시글이 존재하지 않으면 NotFoundError를 던진다', async () => {
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue(null);

      await expect(articleService.updateArticle(1, 1, updatedData)).rejects.toThrow(NotFoundError);
    });

    test('게시글의 주인이 아니면 ForbiddenError를 던진다', async () => {
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue({
        ...mockArticle,
        userId: 999,
      });

      await expect(articleService.updateArticle(1, 1, updatedData)).rejects.toThrow(ForbiddenError);
    });

    test('게시글을 수정할 수 있다', async () => {
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue(mockArticle);
      jest.spyOn(articleRepository, 'updateArticle').mockResolvedValue({
        ...mockArticle,
        ...updatedData,
      });

      const result = await articleService.updateArticle(1, 1, updatedData);

      expect(result).toEqual({ ...mockArticle, ...updatedData });
    });
  });

  describe('deleteArticle', () => {
    test('게시글이 존재하지 않으면 NotFoundError를 던진다', async () => {
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue(null);

      await expect(articleService.deleteArticle(1, 1)).rejects.toThrow(NotFoundError);
    });

    test('게시글의 소유자가 아니면 ForbiddenError를 던진다', async () => {
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue({
        ...mockArticle,
        userId: 999,
      });

      await expect(articleService.deleteArticle(1, 1)).rejects.toThrow(ForbiddenError);
    });

    test('게시글을 삭제할 수 있다', async () => {
      jest.spyOn(articleRepository, 'getArticleById').mockResolvedValue(mockArticle);
      jest.spyOn(articleRepository, 'deleteArticle').mockResolvedValue(mockArticle);

      const result = await articleService.deleteArticle(1, 1);

      expect(articleRepository.deleteArticle).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockArticle);
    });
  });
});
