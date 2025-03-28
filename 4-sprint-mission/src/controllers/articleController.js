import express from "express";
import articleService from "../service/articleService.js";
import { verifyAccessToken } from "../middlewares/jwtAuth.js";

const articleController = express.Router();

// 아티클 생성
articleController.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const createdArticle = await articleService.create(req.body);
    return res.json(createdArticle);
  } catch (error) {
    next(error);
  }
});

// 아티클 ID 조회
articleController.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const article = await articleService.getById(id);
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
    const updatedArticle = await articleService.update(id, updatedArticleData);
    return res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
});

// 아티클 삭제
articleController.delete("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    await articleService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default articleController;
