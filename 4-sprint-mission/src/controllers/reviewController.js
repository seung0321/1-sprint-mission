import express from "express";
import reviewService from "../service/reviewService.js";
import { verifyAccessToken, verifyReviewAuth } from "../middlewares/jwtAuth.js";

const reviewController = express.Router();

reviewController.post("/", verifyAccessToken, async (req, res, next) => {
  const { userId } = req.user;
  try {
    const createdReview = await reviewService.create({
      ...req.body,
      authorId: userId,
    });
    return res.status(201).json(createdReview);
  } catch (error) {
    return next(error);
  }
});

reviewController.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const review = await reviewService.getById(id);
    return res.json(review);
  } catch (error) {
    return next(error);
  }
});

reviewController.get("/", async (req, res, next) => {
  try {
    const reviews = await reviewService.getAll();
    return res.json(reviews);
  } catch (error) {
    return next(error);
  }
});

reviewController.put(
  "/:id",
  verifyAccessToken,
  verifyReviewAuth,
  async (req, res, next) => {
    try {
      const updatedReview = await reviewService.update(req.params.id, req.body);
      return res.json(updatedReview);
    } catch (error) {
      return next(error);
    }
  }
);

reviewController.delete(
  "/:id",
  verifyAccessToken,
  verifyReviewAuth,
  async (req, res, next) => {
    try {
      const deletedReview = await reviewService.deleteById(req.params.id);
      return res.json(deletedReview);
    } catch (error) {
      return next(error);
    }
  }
);

export default reviewController;
