import { productService } from './productService';
import { productRepository } from '../repositories/productRepository';
import { notificationService } from './notificationService';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { io, userSockets } from './socketService';

jest.mock('../repositories/productRepository');
jest.mock('./notificationService');
jest.mock('./socketService', () => ({
  io: { to: jest.fn().mockReturnThis(), emit: jest.fn() },
  userSockets: new Map<number, string>(),
}));

describe('상품 서비스', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'desc',
    price: 1000,
    tags: ['tag'],
    images: ['img.jpg'],
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    favoriteCount: 0,
    isFavorited: false,
    favorites: [
      {
        id: 1,
        productId: 1,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    test('상품을 생성 할 수 있다', async () => {
      jest.mocked(productRepository.createProduct).mockResolvedValue(mockProduct);

      const result = await productService.createProduct(
        {
          name: mockProduct.name,
          description: mockProduct.description,
          price: mockProduct.price,
          tags: mockProduct.tags,
        },
        mockProduct.userId,
      );
      expect(productRepository.createProduct).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...mockProduct,
        favoriteCount: 0,
        isFavorited: false,
      });
    });
  });

  describe('getProductById', () => {
    test('상품의 아이디가 존재하지 않으면 NotFoundError를 발생시켜야 한다', async () => {
      jest.mocked(productRepository.findProductById).mockResolvedValue(null);

      await expect(productService.getProduct(999)).rejects.toThrow(NotFoundError);
    });
    test('상품의 아이디로 정보를 조회한다', async () => {
      jest.mocked(productRepository.findProductById).mockResolvedValue({
        ...mockProduct,
        favorites: [
          {
            id: 1,
            productId: mockProduct.id,
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });

      const result = await productService.getProduct(mockProduct.id, 1);

      expect(result).toEqual({
        ...mockProduct,
        favorites: undefined,
        favoriteCount: 1,
        isFavorited: true,
      });
    });
  });

  describe('getProductList', () => {
    test('상품의 목록을 조회한다', async () => {
      jest.mocked(productRepository.findProducts).mockResolvedValue([mockProduct]);
      jest.mocked(productRepository.countProducts).mockResolvedValue(1);

      const result = await productService.getProductList(1, 10, 'recent');

      expect(result).toEqual({
        list: [
          {
            ...mockProduct,
            favorites: undefined,
            favoriteCount: 1,
            isFavorited: undefined,
          },
        ],
        totalCount: 1,
      });
    });
  });

  describe('updateProduct 함수', () => {
    const updatedData = {
      name: '업데이트된 테스트 Product',
      description: '이것은 업데이트된 테스트 Product 설명입니다.',
      price: 15000,
      tags: ['업데이트', 'Product'],
      images: ['업데이트된_image1.png'],
    };
    test('상품이 존재하지 않으면 NotFoundError를 던진다', async () => {
      jest.mocked(productRepository.findProductById).mockResolvedValue(null);

      await expect(productService.updateProduct(1, updatedData, 1)).rejects.toThrow(NotFoundError);
    });

    test('상품의 주인이 아니면 ForbiddenError를 던진다', async () => {
      jest
        .mocked(productRepository.findProductById)
        .mockResolvedValue({ ...mockProduct, userId: 999 });

      await expect(productService.updateProduct(1, updatedData, 1)).rejects.toThrow(ForbiddenError);
    });
    test('상품 수정 중 가격이 변경된 경우 알림을 생성 및 전송해야 한다', async () => {
      jest.mocked(productRepository.findProductById).mockResolvedValue(mockProduct);
      jest.mocked(productRepository.updateProduct).mockResolvedValue({
        ...mockProduct,
        price: 2000,
      });

      const emitMock = jest.fn();
      (io.to as jest.Mock).mockReturnValue({ emit: emitMock });
      userSockets.set(2, 'socket-id');

      const result = await productService.updateProduct(1, { price: 2000 }, 1);

      expect(notificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 2,
          payload: expect.objectContaining({ oldPrice: 1000, newPrice: 2000 }),
        }),
      );

      expect(io.to).toHaveBeenCalledWith('socket-id');
      expect(emitMock).toHaveBeenCalledWith(
        'notification',
        expect.objectContaining({
          payload: { productId: 1, oldPrice: 1000, newPrice: 2000 },
        }),
      );

      expect(result.price).toBe(2000);
    });
  });

  describe('deleteProduct', () => {
    test('상품이 존재하지 않으면 NotFoundError를 던진다', async () => {
      jest.mocked(productRepository.findProductById).mockResolvedValue(null);

      await expect(productService.deleteProduct(1, 1)).rejects.toThrow(NotFoundError);
    });

    test('상품의 소유자가 아니면 ForbiddenError를 던진다', async () => {
      jest.mocked(productRepository.findProductById).mockResolvedValue({
        ...mockProduct,
        userId: 999,
      });

      await expect(productService.deleteProduct(1, 1)).rejects.toThrow(ForbiddenError);
    });

    test('상품을 삭제할 수 있다', async () => {
      jest.mocked(productRepository.findProductById).mockResolvedValue(mockProduct);
      jest.mocked(productRepository.deleteProduct).mockResolvedValue(mockProduct);

      await productService.deleteProduct(1, 1);

      expect(productRepository.findProductById).toHaveBeenCalledWith(1);
      expect(productRepository.deleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
