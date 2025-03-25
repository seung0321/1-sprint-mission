import express from "express";
import boardService from "../service/boardService.js";
import { verifyAccessToken } from "../middlewares/jwtAuth.js";

const boardController = express.Router();

boardController.post("/", verifyAccessToken, async (req, res, next) => {
  try {
    const createdBoard = await boardService.create(req.body);
    return res.json(createdBoard);
  } catch (error) {
    next(error);
  }
});

boardController.get("/:id", async (req, res) => {
  const { id } = req.params;
  const board = await boardService.getById(id);
  return res.json(board);
});

boardController.put("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;
  const updatedBoardData = req.body;

  try {
    const updatedBoard = await boardService.update(id, updatedBoardData);
    return res.json(updatedBoard);
  } catch (error) {
    next(error);
  }
});

boardController.delete("/:id", verifyAccessToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    await boardService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default boardController;
