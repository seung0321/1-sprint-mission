import commentRepository from "../repositories/commentRepository.js";

// 댓글 생성
async function create(comment) {
  return commentRepository.save(comment);
}

// 특정 ID 댓글 조회
async function getById(id) {
  return commentRepository.getById(id);
}

// 모든 댓글 조회
async function getAll() {
  return commentRepository.getAll();
}

// 특정 ID의 댓글 수정
async function update(id, comment) {
  return commentRepository.update(id, comment);
}

// 특정 ID의 댓글 삭제
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
