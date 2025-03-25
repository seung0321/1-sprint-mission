import { expressjwt } from "express-jwt";
import reviewRepository from "../repositories/reviewRepository.js";

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.refreshToken,
});

async function verifyReviewAuth(req, res, next) {
  const { id: reviewId } = req.params; // URL 파라미터에서 리뷰 ID를 가져옵니다.
  const { userId } = req.user; // 인증된 사용자(user)가 요청한 사용자 ID를 가져옵니다.

  try {
    const review = await reviewRepository.getById(reviewId); // 리뷰 ID로 해당 리뷰를 데이터베이스에서 조회
    if (!review) {
      const error = new Error("Review not found"); // 리뷰가 없으면 오류 발생
      error.code = 404; // 404: 리뷰를 찾을 수 없음
      throw error;
    }

    // 리뷰의 작성자 ID가 요청한 사용자의 ID와 일치하는지 확인
    if (review.authorId !== userId) {
      const error = new Error("Forbidden"); // 작성자와 다른 사용자가 접근하려고 하면 오류 발생
      error.code = 403; // 403: 금지된 접근
      throw error;
    }

    return next(); // 권한이 확인되면, 요청을 다음 미들웨어로 넘깁니다.
  } catch (error) {
    return next(error); // 오류가 발생하면 다음 미들웨어로 전달
  }
}

export { verifyAccessToken, verifyRefreshToken, verifyReviewAuth };
