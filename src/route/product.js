import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "../structs.js";

const ProductRouter = express.Router();
const prisma = new PrismaClient();

// products
ProductRouter.route("/")
  .get(async (req, res) => {
    try {
      const { offset = 0, limit = 10, order, name, description } = req.query;
      let orderBy;

      switch (order) {
        case "priceLowest":
          orderBy = { price: "asc" };
          break;
        case "priceHighest":
          orderBy = { price: "desc" };
          break;
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
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(description && {
          description: { contains: description, mode: "insensitive" },
        }),
      };

      const products = await prisma.product.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });

      console.log(products);
      res.status(200).send(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      assert(req.body, CreateProduct);
      const product = await prisma.product.create({
        data: req.body,
      });
      res.send(product);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  });

ProductRouter.route("/:id")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      console.log(product);
      res.send(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  })
  .patch(async (req, res) => {
    try {
      const { id } = req.params;
      assert(req.body, PatchProduct);
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.send(product);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: e.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });
      res.status(200).json({ message: "성공적으로 삭제가 완료되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

export default ProductRouter;
