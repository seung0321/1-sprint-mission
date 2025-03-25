import prisma from "../config/prisma.js";

async function getById(id) {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}

async function save(product) {
  return await prisma.product.create({
    data: {
      name: product.name,
      price: parseInt(product.price, 10),
    },
  });
}

async function update(id, productData) {
  return await prisma.product.update({
    where: {
      id: parseInt(id, 10),
    },
    data: productData,
  });
}

async function deleteProduct(id) {
  return await prisma.product.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
}

export default {
  getById,
  save,
  update,
  delete: deleteProduct,
};
