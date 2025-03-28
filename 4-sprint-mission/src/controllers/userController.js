import express from "express";
import userService from "../service/userService.js";
import upload from "../middlewares/upload.js"; // multer를 통한 이미지 업로드 미들웨어
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middlewares/jwtAuth.js";

const userController = express.Router();

// 유저 회원가입
userController.post(
  "/users",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const userData = { ...req.body };

      // 이미지 파일 경로 처리
      if (req.file) {
        userData.image = `/uploads/${req.file.filename}`; // 저장된 이미지 경로
      }

      const user = await userService.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// 유저 토큰 로그인
userController.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUser(email, password);
    const accessToken = userService.createToken(user);
    const refreshToken = userService.createToken(user, "refresh");

    await userService.updateUser(user.id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

// 액세스, 리프레시 토큰 재발급
userController.post(
  "/token/refresh",
  verifyRefreshToken,
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
        sameSite: "None",
        secure: true,
      });

      return res.json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
);

// 유저 정보 조회
userController.get("/userID", verifyAccessToken, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.userId);
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

// 유저 정보 및 비밀번호 수정
userController.put(
  "/userUpdate",
  verifyAccessToken,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const userData = { ...req.body };

      // 이미지 파일 경로 처리
      if (req.file) {
        userData.image = `/uploads/${req.file.filename}`; // 저장된 이미지 경로
      }

      const updatedUser = await userService.updateUser(
        req.user.userId,
        userData
      );
      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

export default userController;
