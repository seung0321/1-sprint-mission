import express from "express";
import articleService from "../service/articleService.js";
import { verifyAccessToken } from "../middlewares/jwtAuth.js";

const articleController = express.Router();

// 아티클 생성
articleController.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const articleData = { ...req.body, userId };
    const createdArticle = await articleService.create(articleData);
    return res.json(createdArticle);
  } catch (error) {
    next(error);
  }
});

// 아티클 조회
articleController.get("/", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const article = await articleService.getById(userId);
    return res.json(article);
  } catch (error) {
    next(error);
  }
});

// 아티클 수정
articleController.put("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;
  const updatedArticleData = req.body;

  try {
    const userId = req.user.userId;
    const updatedArticle = await articleService.update(
      id,
      updatedArticleData,
      userId
    );
    return res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
});

// 아티클 삭제
articleController.delete("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    const userId = req.user.userId;
    await articleService.delete(id, userId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default articleController;
