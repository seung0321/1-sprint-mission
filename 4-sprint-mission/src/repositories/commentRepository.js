import prisma from "../config/prisma.js";

// 리뷰를 저장하는 함수
async function save(comment) {
  const createdComment = await prisma.comment.create({
    data: {
      title: comment.title,
      description: comment.description,
      rating: comment.rating,
      board: {
        connect: {
          id: comment.boardId,
        },
      },
      author: {
        connect: {
          id: comment.authorId,
        },
      },
    },
  });
  return createdComment;
}

// ID로 특정 리뷰를 조회하는 함수
async function getById(id) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return comment;
}

// 모든 리뷰를 조회하는 함수
async function getAll() {
  const comments = await prisma.comment.findMany();
  return comments;
}

// 특정 리뷰를 업데이트하는 함수
async function update(id, comment) {
  const updatedComment = await prisma.comment.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      title: comment.title,
      description: comment.description,
      rating: comment.rating,
    },
  });
  return updatedComment;
}

// ID로 특정 리뷰를 삭제하는 함수
async function deleteById(id) {
  const deletedComment = await prisma.comment.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  return deletedComment;
}

export default {
  save,
  getById,
  getAll,
  update,
  deleteById,
};
