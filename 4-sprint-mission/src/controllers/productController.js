import express from "express";
import productService from "../service/productService.js";
import { verifyAccessToken } from "../middlewares/jwtAuth.js";

const productController = express.Router();

productController.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const createdProduct = await productService.create(req.body);
    return res.json(createdProduct);
  } catch (error) {
    next(error);
  }
});

productController.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

productController.put("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;
  const updatedProductData = req.body;

  try {
    const updatedProduct = await productService.update(id, updatedProductData);
    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

productController.delete("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    await productService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default productController;
