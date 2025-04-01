import prisma from "../config/prisma.js";

// ID로 특정 게시판을 조회하는 함수
async function getById(id) {
  return await prisma.board.findUnique({
    where: {
      id: parseInt(id, 10),
    },
    orderBy: { createdAt: "asc" },
  });
}

// 새로운 게시판을 저장하는 함수
async function save(board) {
  return await prisma.board.create({
    data: {
      title: board.title,
      description: board.description,
    },
  });
}

// 특정 게시판을 업데이트하는 함수
async function update(id, boardData) {
  return await prisma.board.update({
    where: {
      id: parseInt(id, 10),
    },
    data: boardData,
  });
}

// ID로 특정 게시판을 삭제하는 함수
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
