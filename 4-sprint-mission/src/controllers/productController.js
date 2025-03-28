import express from "express";
import productService from "../service/productService.js";
import { verifyAccessToken } from "../middlewares/jwtAuth.js";
import { CreateProduct } from "../structs/productStruct.js";
import { assert } from "superstruct";

const productController = express.Router();

// 상품 생성
productController.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    // 유효성 검사
    assert(req.body, CreateProduct);

    const userId = req.user.userId;
    const productData = { ...req.body, userId };
    const createdProduct = await productService.create(productData);
    return res.json(createdProduct);
  } catch (error) {
    next(error);
  }
});

// 상품 조회
productController.get("/", verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const products = await productService.getByUserId(userId);
    return res.json(products);
  } catch (error) {
    next(error);
  }
});

// 상품 수정
productController.put("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;
  const updatedProductData = req.body;

  try {
    // 유효성 검사
    assert(updatedProductData, CreateProduct);

    const userId = req.user.userId;
    const updatedProduct = await productService.update(
      id,
      updatedProductData,
      userId
    );
    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// 상품 삭제
productController.delete("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    const userId = req.user.userId;
    await productService.delete(id, userId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default productController;
