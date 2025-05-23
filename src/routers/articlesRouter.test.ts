import request from 'supertest';
import app from '../app';
import { prismaClient } from '../lib/prismaClient';
import { clearDatabase } from '../lib/utils/testDeleteUtils';
import { registerAndLogin } from '../lib/utils/testAuthUtils';
import { Article } from '@prisma/client';
import { createTestUser, createTestArticle } from '../lib/utils/testArticleUtils';

describe('게시글 API 테스트', () => {
  beforeEach(async () => {
    await clearDatabase(prismaClient);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('POST /articles', () => {
    const articleData = {
      title: '테스트 Article',
      content: '테스트 Article 내용입니다.',
      image: 'image1.jpg',
    };

    test('로그인되지 않은 유저가 등록 시 401을 반환한다.', async () => {
      const response = await request(app).post('/articles').send(articleData);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('로그인한 유저가 게시글을 등록하여 201을 반환한다.', async () => {
      const { agent } = await registerAndLogin();

      const response = await agent.post('/articles').send(articleData);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: articleData.title,
        content: articleData.content,
      });
    });
  });
  describe('GET /articles', () => {
    test('페이지네이션 기반 게시글을 조회하여 200을 반환한다.', async () => {
      const user = await createTestUser();
      await createTestArticle(user.id, { title: '테스트 Article1', content: '내용1' });
      await createTestArticle(user.id, { title: '테스트 Article2', content: '내용2' });

      const page = 1;
      const pageSize = 10;
      const orderBy = 'recent';
      const keyword = '테스트';

      const response = await request(app).get(
        `/articles?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&keyword=${keyword}`,
      );

      const { list, totalCount } = response.body;

      expect(response.status).toBe(200);

      // 리스트 타입 및 개수
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeLessThanOrEqual(pageSize);

      // 정렬 확인
      const ids = list.map((p: any) => p.id);
      expect(ids).toEqual([...ids].sort((a, b) => b - a));

      // 검색 키워드 확인
      list.forEach((article: Article) => {
        expect(article.title.includes(keyword) || article.content.includes(keyword)).toBe(true);

        // 필드 필터링 및 likeCount 확인
        list.forEach((article: any) => {
          expect(article).not.toHaveProperty('likes');
          expect(article).not.toHaveProperty('isLiked');
          expect(typeof article.likeCount).toBe('number');
        });

        //전체 게시글 수 조회
        expect(typeof totalCount).toBe('number');
        expect(totalCount).toBeGreaterThan(0);
      });
    });
  });
  describe('GET /articles/:id', () => {
    test('ID로 게시글을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notArticleId = 9999;
      const response = await request(app).get(`/articles/${notArticleId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });

    test('ID로 게시글을 검색하여 존재하는 ID는 200을 반환한다', async () => {
      const user = await createTestUser();
      const article1 = await createTestArticle(user.id, {
        title: '테스트 Article1',
        content: '내용1',
      });

      const response = await request(app).get(`/articles/${article1.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(article1.id);
    });
  });
  describe('PATCH /articles/:id', () => {
    test('로그인되지 않은 유저가 수정 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const article1 = await createTestArticle(user.id, {
        title: '테스트 Article1',
        content: '내용1',
      });
      const updateArticle = {
        title: '수정 테스트 Article1',
        content: '수정 내용',
      };
      const response = await request(app).patch(`/articles/${article1.id}`).send(updateArticle);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
    test('등록하지 않은 다른 사용자가 게시글을 수정 시 403을 반환한다', async () => {
      const user = await prismaClient.user.create({
        data: {
          email: 'test2@example.com',
          password: 'password',
          nickname: 'test User2',
        },
      });

      const article1 = await prismaClient.article.create({
        data: {
          title: '테스트 Article',
          content: '테스트 Article 내용입니다.',
          image: 'image1.jpg',
          userId: user.id,
        },
      });

      const { agent } = await registerAndLogin();

      const updateArticle = {
        title: '수정 테스트 Article1',
        content: '수정 내용',
      };

      const response = await agent.patch(`/articles/${article1.id}`).send(updateArticle);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You are not the owner of this article.');
    });

    test('로그인한 유저가 ID로 게시글을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const { agent } = await registerAndLogin();
      const notArticleId = 9999;
      const response = await agent.get(`/articles/${notArticleId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${notArticleId} not found`);
    });

    test('로그인한 유저가 ID로 게시글을 검색하여 해당 게시글을 수정하면 200을 반환한다', async () => {
      const { agent, user } = await registerAndLogin();
      const article1 = await prismaClient.article.create({
        data: {
          title: '테스트 Article',
          content: '테스트 Article 내용입니다.',
          image: 'image1.jpg',
          userId: user.body.id,
        },
      });
      const updateArticle = {
        title: '수정 테스트 Article1',
        content: '수정 내용',
      };
      const response = await agent.patch(`/articles/${article1.id}`).send(updateArticle);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(article1.id);
      expect(response.body.title).toBe(updateArticle.title);
      expect(response.body.content).toEqual(updateArticle.content);
    });
  });
  describe('DELETE /articles/:id', () => {
    test('로그인되지 않은 유저가 삭제 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const article1 = await createTestArticle(user.id, {
        title: '테스트 Article1',
        content: '내용1',
      });
      const response = await request(app).delete(`/articles/${article1.id}`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('등록하지 않은 다른 사용자가 게시글을 삭제 시 403을 반환한다', async () => {
      const user = await prismaClient.user.create({
        data: {
          email: 'test2@example.com',
          password: 'password',
          nickname: 'test User2',
        },
      });

      const article1 = await prismaClient.article.create({
        data: {
          title: '테스트 Article',
          content: '테스트 Article 내용입니다.',
          image: 'image1.jpg',
          userId: user.id,
        },
      });

      const { agent } = await registerAndLogin();

      const response = await agent.delete(`/articles/${article1.id}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You are not the owner of this article.');
    });

    test('로그인한 유저가 ID로 게시글을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const { agent } = await registerAndLogin();
      const notArticleId = 9999;
      const response = await agent.get(`/articles/${notArticleId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${notArticleId} not found`);
    });

    test('로그인한 유저가 ID로 게시글을 검색하여 게시글을 삭제하면 200을 반환한다', async () => {
      const { agent, user } = await registerAndLogin();
      const article1 = await prismaClient.article.create({
        data: {
          title: '테스트 Article',
          content: '테스트 Article 내용입니다.',
          image: 'image1.jpg',
          userId: user.body.id,
        },
      });
      const response = await agent.delete(`/articles/${article1.id}`);
      expect(response.status).toBe(204);
      const getResponse = await agent.get(`/articles/${article1.id}`);
      expect(getResponse.status).toBe(404);
    });
  });
  describe('POST /articles/:id/comments', () => {
    test('로그인되지 않은 유저가 댓글 생성 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const article1 = await createTestArticle(user.id, {
        title: '테스트 Article1',
        content: '내용1',
      });
      const comment = await prismaClient.comment.create({
        data: { userId: user.id, articleId: article1.id, content: '댓글 테스트 입니다.' },
      });
      const response = await request(app).post(`/articles/${article1.id}/comments`).send(comment);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('로그인한 유저가 ID로 게시글을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const { agent } = await registerAndLogin();
      const notArticleId = 9999;
      const response = await agent.get(`/articles/${notArticleId}/comments`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${notArticleId} not found`);
    });

    test('로그인한 유저가 게시글을 ID로 검색하여 해당 게시글에 댓글을 생성하면 200을 반환한다', async () => {
      const { agent, user } = await registerAndLogin();
      const article1 = await prismaClient.article.create({
        data: {
          title: '테스트 Article',
          content: '테스트 Article 내용입니다.',
          image: 'image1.jpg',
          userId: user.body.id,
        },
      });
      const comment = {
        content: '댓글 테스트 입니다.',
      };

      const response = await agent.post(`/articles/${article1.id}/comments`).send(comment);
      expect(response.status).toBe(201);
      expect(response.body.content).toBe(comment.content);
    });
  });
  test('다른 사용자가 댓글 작성 시 게시글 작성자에게 알림이 생성된다', async () => {
    const user2 = await prismaClient.user.create({
      data: {
        email: 'test2@example.com',
        password: 'password',
        nickname: 'test User2',
      },
    });

    const article = await prismaClient.article.create({
      data: {
        title: '테스트 Article',
        content: '테스트 Article 내용입니다.',
        image: 'image1.jpg',
        userId: user2.id,
      },
    });

    const { agent } = await registerAndLogin();
    const comment = {
      content: '댓글 테스트 입니다.',
    };

    const response = await agent.post(`/articles/${article.id}/comments`).send(comment);
    expect(response.status).toBe(201);

    const notifications = await prismaClient.notification.findMany({
      where: {
        userId: user2.id,
        type: 'create_comment',
      },
    });

    expect(notifications.length).toBeGreaterThan(0);
    const payload = notifications[0].payload as { articleId: number; content: string };
    expect(payload.articleId).toBe(article.id);
    expect(payload.content).toBe(comment.content);
  });
  describe('GET /articles/:id/comments', () => {
    test('ID로 게시글을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notArticleId = 9999;
      const response = await request(app).get(`/articles/${notArticleId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${notArticleId} not found`);
    });
    test('ID로 검색한 해당 게시글에 대한 댓글 조회 시 200을 반환하고, 댓글 목록을 응답한다', async () => {
      const user = await createTestUser();
      const article1 = await createTestArticle(user.id, {
        title: '테스트 Article1',
        content: '내용1',
      });

      const commentContents = Array.from({ length: 10 }).map((_, i) => `테스트 댓글 ${i + 1}`);

      const commentPromises = commentContents.map((content) =>
        prismaClient.comment.create({
          data: {
            userId: user.id,
            articleId: article1.id,
            content,
          },
        }),
      );

      await Promise.all(commentPromises);

      const response = await request(app).get(`/articles/${article1.id}/comments`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.list)).toBe(true);
      expect(response.body.list.length).toBeGreaterThanOrEqual(10);
      const returnedContents = response.body.list.map((c: any) => c.content);
      expect(returnedContents).toEqual(expect.arrayContaining(commentContents));
    });
  });
  describe('POST /articles/:id/likes', () => {
    test('로그인되지 않은 유저가 게시글에 좋아요 요청 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const article1 = await createTestArticle(user.id, {
        title: '테스트 Article1',
        content: '내용1',
      });
      const response = await request(app).post(`/articles/${article1.id}/likes`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
    test('ID로 게시글을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notArticleId = 9999;
      const response = await request(app).get(`/articles/${notArticleId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${notArticleId} not found`);
    });
    test('로그인한 유저가 게시글에 좋아요 요청 시 201을 반환한다.', async () => {
      const { agent, user } = await registerAndLogin();
      const article1 = await prismaClient.article.create({
        data: {
          title: '테스트 Article',
          content: '테스트 Article 내용입니다.',
          image: 'image1.jpg',
          userId: user.body.id,
        },
      });

      const response = await agent.post(`/articles/${article1.id}/likes`);
      expect(response.status).toBe(201);
      const getRes = await request(app).get(`/articles/${article1.id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.likeCount).toBe(1);
    });
  });
  describe('DELETE /articles/:id/likes', () => {
    test('로그인되지 않은 유저가 게시글에 좋아요 취소 요청 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const article1 = await createTestArticle(user.id, {
        title: '테스트 Article1',
        content: '내용1',
      });
      const response = await request(app).delete(`/articles/${article1.id}/likes`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
    test('ID로 게시글을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notArticleId = 9999;
      const response = await request(app).get(`/articles/${notArticleId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`article with id ${notArticleId} not found`);
    });
    test('로그인한 유저가 게시글에 좋아요 취소 요청 시 204을 반환한다.', async () => {
      const { agent, user } = await registerAndLogin();
      const article1 = await prismaClient.article.create({
        data: {
          title: '테스트 Article',
          content: '테스트 Article 내용입니다.',
          image: 'image1.jpg',
          userId: user.body.id,
        },
      });

      const response = await agent.post(`/articles/${article1.id}/likes`);
      expect(response.status).toBe(201);
      const deleteResponse = await agent.delete(`/articles/${article1.id}/likes`);
      expect(deleteResponse.status).toBe(204);
      const getRes = await request(app).get(`/articles/${article1.id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.likeCount).toBe(0);
    });
  });
});
