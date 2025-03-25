import reviewRepository from "../repositories/reviewRepository.js";

// 새로운 리뷰를 생성하는 함수
async function create(review) {
  return reviewRepository.save(review);
}

// 특정 ID에 해당하는 리뷰를 조회하는 함수
async function getById(id) {
  return reviewRepository.getById(id);
}

// 모든 리뷰를 조회하는 함수
async function getAll() {
  return reviewRepository.getAll();
}

// 특정 ID의 리뷰를 업데이트하는 함수
async function update(id, review) {
  return reviewRepository.update(id, review);
}

// 특정 ID의 리뷰를 삭제하는 함수
async function deleteById(id) {
  return reviewRepository.deleteById(id);
}

export default {
  create,
  getById,
  getAll,
  update,
  deleteById,
};
