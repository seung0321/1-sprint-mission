import commentRepository from "../repositories/commentRepository.js";

// 새로운 리뷰를 생성하는 함수
async function create(comment) {
  return commentRepository.save(comment);
}

// 특정 ID에 해당하는 리뷰를 조회하는 함수
async function getById(id) {
  return commentRepository.getById(id);
}

// 모든 리뷰를 조회하는 함수
async function getAll() {
  return commentRepository.getAll();
}

// 특정 ID의 리뷰를 업데이트하는 함수
async function update(id, comment) {
  return commentRepository.update(id, comment);
}

// 특정 ID의 리뷰를 삭제하는 함수
async function deleteById(id) {
  return commentRepository.deleteById(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
};
