import prisma from "../config/prisma.js";

// 유저 ID에 맞는 상품 조회
async function findByUserId(userId) {
  return await prisma.product.findMany({
    where: { userId: parseInt(userId, 10) },
  });
}

// 상품 ID와 유저 ID로 특정 상품 조회
async function getById(id, userId) {
  return await prisma.product.findFirst({
    where: {
      id: parseInt(id, 10), // id는 Int로 유지
      userId: parseInt(userId, 10),
    },
  });
}

// 상품 생성
async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      description: product.description, // description 추가
      price: parseFloat(product.price),
      tag: product.tag, // tag는 category enum 사용
      userId: parseInt(product.userId, 10),
    },
  });
}

// 상품 수정
async function update(id, productData) {
  return await prisma.product.update({
    where: { id: parseInt(id, 10) }, // id는 Int로 유지
    data: productData,
  });
}

// 상품 삭제
async function deleteProduct(id) {
  return await prisma.product.delete({
    where: { id: parseInt(id, 10) }, // id는 Int로 유지
  });
}

export default {
  findByUserId,
  getById,
  save,
  update,
  delete: deleteProduct,
};
