import prisma from "../config/prisma.js";

// 리뷰를 저장하는 함수
async function save(review) {
  const createdReview = await prisma.review.create({
    data: {
      title: review.title,
      description: review.description,
      rating: review.rating,
      board: {
        connect: {
          id: review.boardId,
        },
      },
      author: {
        connect: {
          id: review.authorId,
        },
      },
    },
  });
  return createdReview;
}

// ID로 특정 리뷰를 조회하는 함수
async function getById(id) {
  const review = await prisma.review.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return review;
}

// 모든 리뷰를 조회하는 함수
async function getAll() {
  const reviews = await prisma.review.findMany();
  return reviews;
}

// 특정 리뷰를 업데이트하는 함수
async function update(id, review) {
  const updatedReview = await prisma.review.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      title: review.title,
      description: review.description,
      rating: review.rating,
    },
  });
  return updatedReview;
}

// ID로 특정 리뷰를 삭제하는 함수
async function deleteById(id) {
  const deletedReview = await prisma.review.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  return deletedReview;
}

export default {
  save,
  getById,
  getAll,
  update,
  deleteById,
};
