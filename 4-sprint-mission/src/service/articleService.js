import articleRepository from "../repositories/articleRepository.js";

// 특정 아티클을 ID로 조회하는 함수
async function getById(userId) {
  return await articleRepository.getById(userId);
}

// 새로운 아티클을 생성하는 함수
async function create(article) {
  return await articleRepository.save({ ...article, userId: article.userId });
}

// 특정 아티클을 수정하는 함수 (존재 여부 확인 포함)
async function update(id, articleData, userId) {
  const existingArticle = await articleRepository.getById(id, userId);
  if (!existingArticle) {
    throw new Error("Article not found");
  }
  return await articleRepository.update(id, articleData);
}

// 특정 아티클을 삭제하는 함수 (존재 여부 확인 포함)
async function deleteArticle(id, userId) {
  const existingArticle = await articleRepository.getById(id, userId);
  if (!existingArticle) {
    throw new Error("Article not found");
  }
  return await articleRepository.delete(id);
}

export default {
  getById,
  create,
  update,
  delete: deleteArticle,
};
