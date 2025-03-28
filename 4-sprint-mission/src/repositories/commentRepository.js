import prisma from "../config/prisma.js";

// 댓글 생성
async function save(comment) {
  const {
    title,
    description,
    rating,
    boardId,
    productId,
    articleId,
    authorId,
  } = comment;

  const createdComment = await prisma.comment.create({
    data: {
      title,
      description,
      rating,
      author: {
        connect: { id: authorId },
      },
      // 댓글이 작성된 항목에 맞는 관계 설정
      ...(boardId && { board: { connect: { id: boardId } } }),
      ...(productId && { product: { connect: { id: productId } } }),
      ...(articleId && { article: { connect: { id: articleId } } }),
    },
  });

  return createdComment;
}

// ID로 댓글 조회
async function getById(id) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return comment;
}

// 모든 댓글 조회
async function getAll() {
  return await prisma.comment.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
}

// 특정 댓글 수정
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

// ID로 특정 댓글 삭제
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
