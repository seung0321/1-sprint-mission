import prisma from "../config/prisma.js";

async function getById(id) {
  return await prisma.board.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}

async function save(board) {
  return await prisma.board.create({
    data: {
      title: board.title,
      description: board.description,
    },
  });
}

async function update(id, boardData) {
  return await prisma.board.update({
    where: {
      id: parseInt(id, 10),
    },
    data: boardData,
  });
}

async function deleteBoard(id) {
  return await prisma.board.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
}

export default {
  getById,
  save,
  update,
  delete: deleteBoard,
};
