import boardRepository from "../repositories/boardRepository.js";

async function getById(id) {
  return await boardRepository.getById(id);
}

async function create(board) {
  return await boardRepository.save(board);
}

async function update(id, boardData) {
  const existingBoard = await boardRepository.getById(id);
  if (!existingBoard) {
    throw new Error("Board not found");
  }
  return await boardRepository.update(id, boardData);
}

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
