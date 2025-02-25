import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const CommentRouter = express.Router();

CommentRouter.route("/")
  .get(async (req, res) => {
    const { cursor, limit = 10, boardType } = req.query;

    if (!boardType) {
      return res.status(400).json({ error: "게시판 종류를 지정해야 합니다." });
    }

    const cursorCondition = cursor
      ? { createdAt: { gt: new Date(cursor) } }
      : {};

    try {
      const comments = await prisma.comment.findMany({
        where: { boardType, ...cursorCondition },
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });

      const nextCursor =
        comments.length > 0 ? comments[comments.length - 1].createdAt : null;

      res.status(200).json({ comments, nextCursor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    const { content, productId, articleId, boardType } = req.body;

    if (!content || !(productId || articleId) || !boardType) {
      return res.status(400).json({
        error: "댓글 내용, 제품/게시판 ID, 게시판 종류가 필요합니다.",
      });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          productId: boardType === "products" ? productId : null,
          articleId: boardType === "articles" ? articleId : null,
          boardType,
        },
      });
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
CommentRouter.route("/:id")
  .patch(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ error: "수정할 댓글 내용을 입력해야 합니다." });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: { id },
        data: { content },
      });

      res.status(200).json(updatedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.comment.delete({
        where: { id },
      });
      res.status(200).json({ message: "성공적으로 삭제되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

export default CommentRouter;
