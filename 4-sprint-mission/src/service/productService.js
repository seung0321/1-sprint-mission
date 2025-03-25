import productRepository from "../repositories/productRepository.js";

// 특정 유저가 등록한 모든 상품을 조회하는 함수
async function getByUserId(userId) {
  return await productRepository.findByUserId(userId);
}

// 새로운 상품을 생성하는 함수
async function create(product) {
  return await productRepository.save({ ...product, userId: product.userId });
}

// 특정 상품을 업데이트하는 함수
async function update(id, productData, userId) {
  const existingProduct = await productRepository.getById(id, userId);
  if (!existingProduct) {
    throw new Error("Product not found or unauthorized");
  }

  return await productRepository.update(id, productData);
}

// 특정 상품을 삭제하는 함수 (유저 권한 검증 포함)
async function deleteProduct(id, userId) {
  const existingProduct = await productRepository.getById(id, userId);
  if (!existingProduct) {
    throw new Error("Product not found or unauthorized");
  }

  return await productRepository.delete(id);
}

export default {
  getByUserId,
  create,
  update,
  delete: deleteProduct,
};
