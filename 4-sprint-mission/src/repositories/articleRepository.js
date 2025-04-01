import prisma from "../config/prisma.js";

// ID로 특정 아티클을 조회하는 함수
async function getById(userId) {
  return await prisma.article.findMany({
    where: {
      userId: parseInt(userId, 10),
    },
    orderBy: { createdAt: "asc" },
  });
}

// 새로운 아티클을 저장하는 함수
async function save(article) {
  return await prisma.article.create({
    data: {
      title: article.title,
      content: article.content,
      userId: parseInt(article.userId, 10),
    },
  });
}

// 특정 아티클을 업데이트하는 함수
async function update(id, articleData) {
  return await prisma.article.update({
    where: {
      id: parseInt(id, 10),
    },
    data: articleData,
  });
}

// ID로 특정 아티클을 삭제하는 함수
async function deleteArticle(id) {
  return await prisma.article.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
}

export default {
  getById,
  save,
  update,
  delete: deleteArticle,
};
