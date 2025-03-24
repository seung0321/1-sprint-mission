import express from "express";
import userService from "../service/userService.js";

import auth from "../middlewares/jwtAuth.js";
const userController = express.Router();

userController.post("/users", async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");
    await userService.updateUser(user.id, { refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

userController.post(
  "/token/refresh",
  auth.verifyRefreshToken,
  async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      const { userId } = req.auth;
      const { accessToken, newRefreshToken } = await userService.refreshToken(
        userId,
        refreshToken
      );
      await userService.updateUser(userId, { refreshToken: newRefreshToken });
      res.cookie("refreshToken", newRefreshToken, {
        path: "/token/refresh",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
