import productRepository from "../repositories/productRepository.js";

async function getById(id) {
  return await productRepository.getById(id);
}

async function create(product) {
  return await productRepository.save(product);
}

async function update(id, productData) {
  const existingProduct = await productRepository.getById(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }
  return await productRepository.update(id, productData);
}

async function deleteProduct(id) {
  const existingProduct = await productRepository.getById(id);
  if (!existingProduct) {
    throw new Error("Product not found");
  }
  return await productRepository.delete(id);
}

export default {
  getById,
  create,
  update,
  delete: deleteProduct,
};
