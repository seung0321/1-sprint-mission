import boardRepository from "../repositories/boardRepository.js";

// 특정 게시글을 ID로 조회하는 함수
async function getById(id) {
  return await boardRepository.getById(id);
}

// 새로운 게시글을 생성하는 함수
async function create(board) {
  return await boardRepository.save(board);
}

// 특정 게시글을 수정하는 함수 (존재 여부 확인 포함)
async function update(id, boardData) {
  const existingBoard = await boardRepository.getById(id);
  if (!existingBoard) {
    throw new Error("Board not found");
  }
  return await boardRepository.update(id, boardData);
}

// 특정 게시글을 삭제하는 함수 (존재 여부 확인 포함)
async function deleteBoard(id) {
  const existingBoard = await boardRepository.getById(id);
  if (!existingBoard) {
    throw new Error("Board not found");
  }
  return await boardRepository.delete(id);
}

export default {
  getById,
  create,
  update,
  delete: deleteBoard,
};
