import express from "express";
import commentService from "../service/commentService.js";
import {
  verifyAccessToken,
  verifyCommentAuth,
} from "../middlewares/jwtAuth.js";

const commentController = express.Router();

//댓글 생성
commentController.post("/", verifyAccessToken, async (req, res, next) => {
  const { userId } = req.user;
  const { type, id } = req.body;

  try {
    const createdComment = await commentService.create({
      ...req.body,
      authorId: userId,
      [type + "Id"]: id,
    });
    return res.status(201).json(createdComment);
  } catch (error) {
    return next(error);
  }
});

//ID 댓글 조회
commentController.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const comment = await commentService.getById(id);
    return res.json(comment);
  } catch (error) {
    return next(error);
  }
});

//모든 댓글 조회
commentController.get("/", async (req, res, next) => {
  try {
    const comments = await commentService.getAll();
    return res.json(comments);
  } catch (error) {
    return next(error);
  }
});

//댓글 수정
commentController.put(
  "/:id",
  verifyAccessToken,
  verifyCommentAuth,
  async (req, res, next) => {
    try {
      const updatedComment = await commentService.update(
        req.params.id,
        req.body
      );
      return res.json(updatedComment);
    } catch (error) {
      return next(error);
    }
  }
);

//댓글 삭제
commentController.delete(
  "/:id",
  verifyAccessToken,
  verifyCommentAuth,
  async (req, res, next) => {
    try {
      const deletedComment = await commentService.deleteById(req.params.id);
      return res.json(deletedComment);
    } catch (error) {
      return next(error);
    }
  }
);

export default commentController;
