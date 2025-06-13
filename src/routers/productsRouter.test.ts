import request from 'supertest';
import app from '../main';
import { prismaClient } from '../lib/prismaClient';
import { clearDatabase } from '../lib/utils/testDeleteUtils';
import { registerAndLogin } from '../lib/utils/testAuthUtils';
import { Product } from '@prisma/client';
import { createTestUser, createTestProduct } from '../lib/utils/testProductUtils';
import bcrypt from 'bcrypt';
describe('상품 API 테스트', () => {
  beforeEach(async () => {
    await clearDatabase(prismaClient);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('POST /products', () => {
    const productData = {
      name: '테스트 Product',
      description: '이것은 테스트 Product 설명입니다.',
      price: 100,
      tags: ['주방용품'],
      images: ['image1.png', 'image2.png'],
    };

    test('로그인되지 않은 유저가 등록 시 401을 반환한다.', async () => {
      const response = await request(app).post('/products').send(productData);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('로그인한 유저가 상품을 등록하여 201을 반환한다.', async () => {
      const { agent } = await registerAndLogin();

      const response = await agent.post('/products').send(productData);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: productData.name,
        description: productData.description,
        price: productData.price,
        tags: productData.tags,
        images: productData.images,
      });
    });
  });

  describe('GET /products', () => {
    test('페이지네이션 기반 상품을 조회하여 200을 반환한다.', async () => {
      const user = await createTestUser();
      await createTestProduct(user.id, { name: '테스트 Product1', tags: ['주방용품'] });
      await createTestProduct(user.id, { name: '테스트 Product2', tags: ['운동'] });

      const page = 1;
      const pageSize = 2;
      const orderBy = 'recent';
      const keyword = '테스트';

      const response = await request(app).get(
        `/products?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&keyword=${keyword}`,
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
      list.forEach((product: Product) => {
        expect(product.name.includes(keyword) || product.description.includes(keyword)).toBe(true);

        // 필드 필터링 및 favoriteCount 확인
        list.forEach((product: any) => {
          expect(product).not.toHaveProperty('favorites');
          expect(product).not.toHaveProperty('isFavorited');
          expect(typeof product.favoriteCount).toBe('number');
        });

        //전체 상품 수 조회
        expect(typeof totalCount).toBe('number');
        expect(totalCount).toBeGreaterThan(0);
      });
    });
  });
  describe('GET /products/:id', () => {
    test('ID로 상품을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notProductId = 9999;
      const response = await request(app).get(`/products/${notProductId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${notProductId} not found`);
    });

    test('ID로 상품을 검색하여 존재하는 ID는 200을 반환한다', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct(user.id, {
        name: '테스트 Product1',
        tags: ['주방용품'],
      });
      const product2 = await createTestProduct(user.id, {
        name: '테스트 Product2',
        tags: ['운동'],
      });

      const response = await request(app).get(`/products/${product1.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product1.id);
    });
  });
  describe('PATCH /products/:id', () => {
    test('로그인되지 않은 유저가 수정 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct(user.id, {
        name: '테스트 Product1',
        tags: ['주방용품'],
      });
      const updateProduct = {
        name: '수정 테스트 Product1',
        tags: ['운동'],
      };
      const response = await request(app).patch(`/products/${product1.id}`).send(updateProduct);
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

      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user.id,
        },
      });

      const { agent } = await registerAndLogin();

      const updateProduct = {
        name: '수정 테스트 Product1',
        tags: ['운동'],
      };

      const response = await agent.patch(`/products/${product1.id}`).send(updateProduct);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You are not the owner of this product');
    });

    test('로그인한 유저가 ID로 상품을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const { agent } = await registerAndLogin();
      const notProductId = 9999;
      const response = await agent.get(`/products/${notProductId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${notProductId} not found`);
    });

    test('로그인한 유저가 ID로 상품을 검색하여 해당 상품을 수정하면 200을 반환한다', async () => {
      const { agent, user } = await registerAndLogin();
      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user.body.id,
        },
      });
      const updateProduct = {
        name: '수정 테스트 Product1',
        tags: ['운동'],
      };
      const response = await agent.patch(`/products/${product1.id}`).send(updateProduct);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product1.id);
      expect(response.body.name).toBe(updateProduct.name);
      expect(response.body.tags).toEqual(updateProduct.tags);
    });
    test('상품 등록자가 가격을 수정 시 좋아요를 누른 사용자에게 알림이 생성된다', async () => {
      const { agent, user } = await registerAndLogin();
      const user2 = await prismaClient.user.create({
        data: {
          email: 'test2@example.com',
          password: bcrypt.hashSync('password', 10), // 서버가 해싱 비교할 수 있게!
          nickname: 'test User2',
        },
      });

      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user2.id,
        },
        include: {
          favorites: true,
        },
      });
      const updatedProduct = {
        price: 15000,
      };

      const likeResponse = await agent.post(`/products/${product1.id}/favorites`);
      expect(likeResponse.status).toBe(201);

      const agent2 = request.agent(app);
      const loginRes = await agent2.post('/auth/login').send({
        email: 'test2@example.com',
        password: 'password',
      });
      expect(loginRes.status).toBe(200);
      const updateResponse = await agent2.patch(`/products/${product1.id}`).send(updatedProduct);
      expect(updateResponse.status).toBe(200);

      const notifications = await prismaClient.notification.findMany({
        where: {
          userId: user.body.id,
          type: 'PRICE_FLUCTUATION',
        },
      });

      expect(notifications.length).toBeGreaterThan(0);
      const payload = notifications[0].payload as {
        productId: number;
        oldPrice: number;
        newPrice: number;
      };
      expect(payload.productId).toBe(product1.id);
      expect(payload.oldPrice).toBe(10000);
      expect(payload.newPrice).toBe(15000);
    });
  });

  describe('DELETE /products/:id', () => {
    test('로그인되지 않은 유저가 삭제 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct(user.id, {
        name: '테스트 Product1',
        tags: ['주방용품'],
      });
      const response = await request(app).delete(`/products/${product1.id}`);
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

      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user.id,
        },
      });

      const { agent } = await registerAndLogin();

      const response = await agent.delete(`/products/${product1.id}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You are not the owner of this product');
    });

    test('로그인한 유저가 ID로 상품을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const { agent } = await registerAndLogin();
      const notProductId = 9999;
      const response = await agent.get(`/products/${notProductId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${notProductId} not found`);
    });

    test('로그인한 유저가 ID로 상품을 검색하여 상품을 삭제하면 200을 반환한다', async () => {
      const { agent, user } = await registerAndLogin();
      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user.body.id,
        },
      });
      const response = await agent.delete(`/products/${product1.id}`);
      expect(response.status).toBe(204);
      const getResponse = await agent.get(`/products/${product1.id}`);
      expect(getResponse.status).toBe(404);
    });
  });

  describe('POST /products/:id/comments', () => {
    test('로그인되지 않은 유저가 댓글 생성 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct(user.id, {
        name: '테스트 Product1',
        tags: ['주방용품'],
      });
      const comment = await prismaClient.comment.create({
        data: { userId: user.id, productId: product1.id, content: '댓글 테스트 입니다.' },
      });
      const response = await request(app).post(`/products/${product1.id}/comments`).send(comment);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('로그인한 유저가 ID로 상품을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const { agent } = await registerAndLogin();
      const notProductId = 9999;
      const response = await agent.get(`/products/${notProductId}/comments`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${notProductId} not found`);
    });

    test('로그인한 유저가 상품을 ID로 검색하여 해당 상품에 댓글을 생성하면 200을 반환한다', async () => {
      const { agent, user } = await registerAndLogin();
      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user.body.id,
        },
      });
      const comment = {
        content: '댓글 테스트 입니다.',
      };

      const response = await agent.post(`/products/${product1.id}/comments`).send(comment);
      expect(response.status).toBe(201);
      expect(response.body.content).toBe(comment.content);
    });
  });
  describe('GET /products/:id/comments', () => {
    test('ID로 상품을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notProductId = 9999;
      const response = await request(app).get(`/products/${notProductId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${notProductId} not found`);
    });
    test('ID로 검색한 해당 상품에 대한 댓글 조회 시 200을 반환하고, 댓글 목록을 응답한다', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct(user.id, {
        name: '테스트 Product1',
        tags: ['주방용품'],
      });

      const commentContents = Array.from({ length: 10 }).map((_, i) => `테스트 댓글 ${i + 1}`);

      const commentPromises = commentContents.map((content) =>
        prismaClient.comment.create({
          data: {
            userId: user.id,
            productId: product1.id,
            content,
          },
        }),
      );

      await Promise.all(commentPromises);

      const response = await request(app).get(`/products/${product1.id}/comments`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.list)).toBe(true);
      expect(response.body.list.length).toBeGreaterThanOrEqual(10);
      const returnedContents = response.body.list.map((c: any) => c.content);
      expect(returnedContents).toEqual(expect.arrayContaining(commentContents));
    });
  });
  describe('POST /products/:id/favorites', () => {
    test('로그인되지 않은 유저가 상품에 좋아요 요청 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct(user.id, {
        name: '테스트 Product1',
        tags: ['주방용품'],
      });

      const response = await request(app).post(`/products/${product1.id}/favorites`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
    test('ID로 상품을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notProductId = 9999;
      const response = await request(app).get(`/products/${notProductId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${notProductId} not found`);
    });
    test('로그인한 유저가 상품에 좋아요 요청 시 201을 반환한다.', async () => {
      const { agent, user } = await registerAndLogin();
      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user.body.id,
        },
      });

      const response = await agent.post(`/products/${product1.id}/favorites`);
      expect(response.status).toBe(201);
      const getRes = await request(app).get(`/products/${product1.id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.favoriteCount).toBe(1);
    });
  });
  describe('DELETE /products/:id/favorites', () => {
    test('ID로 상품을 검색하여 존재하지 않는 ID는 404를 반환한다', async () => {
      const notProductId = 9999;
      const response = await request(app).get(`/products/${notProductId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`product with id ${notProductId} not found`);
    });
    test('로그인되지 않은 유저가 상품에 좋아요 취소 요청 시 401을 반환한다.', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct(user.id, {
        name: '테스트 Product1',
        tags: ['주방용품'],
      });
      const response = await request(app).delete(`/products/${product1.id}/favorites`);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
    test('로그인한 유저가 상품에 좋아요 취소 요청 시 204을 반환한다.', async () => {
      const { agent, user } = await registerAndLogin();
      const product1 = await prismaClient.product.create({
        data: {
          name: '테스트 Product',
          description: '이것은 테스트 Product 설명입니다.',
          price: 10000,
          tags: ['태그'],
          images: ['image1.png'],
          userId: user.body.id,
        },
      });

      const response = await agent.post(`/products/${product1.id}/favorites`);
      expect(response.status).toBe(201);
      const deleteResponse = await agent.delete(`/products/${product1.id}/favorites`);
      expect(deleteResponse.status).toBe(204);
      const getRes = await request(app).get(`/products/${product1.id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.favoriteCount).toBe(0);
    });
  });
});
