import { expressjwt } from "express-jwt";
import commentRepository from "../repositories/commentRepository.js";

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

async function verifyCommentAuth(req, res, next) {
  const { id: commentId } = req.params;
  const { userId } = req.user;

  try {
    const comment = await commentRepository.getById(commentId);
    if (!comment) {
      const error = new Error("Comment not found");
      error.code = 404;
      throw error;
    }

    if (comment.authorId !== userId) {
      const error = new Error("Forbidden");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

export { verifyAccessToken, verifyRefreshToken, verifyCommentAuth };
