import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateArticle, PatchArticle } from "../structs.js";

const ArticleRouter = express.Router();
const prisma = new PrismaClient();

// articles
ArticleRouter.route("/")
  .get(async (req, res) => {
    try {
      const { offset = 0, limit = 10, order, title, content } = req.query;
      let orderBy;

      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }

      const where = {
        ...(title && { title: { contains: title, mode: "insensitive" } }),
        ...(content && {
          content: { contains: content, mode: "insensitive" },
        }),
      };

      const articles = await prisma.article.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });

      console.log(articles);
      res.status(200).json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.json(article);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  });

ArticleRouter.route("/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const article = await prisma.article.findUnique({
        where: { id },
      });
      if (!article) {
        return res.status(404).json({ error: "article not found" });
      }
      console.log(article);
      res.json(article);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  })
  .patch(async (req, res) => {
    try {
      const { id } = req.params;
      assert(req.body, PatchArticle);
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.json(article);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.status(200).json({ message: "성공적으로 삭제가 완료되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

export default ArticleRouter;
