import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

// 새로운 유저를 생성하는 함수
async function createUser(user) {
  const existedUser = await userRepository.findByEmail(user.email);

  if (existedUser) {
    const error = new Error("User already exists");
    error.code = 422;
    error.data = { email: user.email };
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password);
  const createdUser = await userRepository.save({
    ...user,
    password: hashedPassword,
  });
  return filterSensitiveUserData(createdUser);
}

// 유저 이메일과 비밀번호로 인증을 수행하는 함수
async function getUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

// ID로 유저 정보를 조회하는 함수
async function getUserById(id) {
  const user = await userRepository.findById(id);

  if (!user) {
    const error = new Error("Not Found");
    error.code = 404;
    throw error;
  }

  return filterSensitiveUserData(user);
}

// 유저 정보를 업데이트하는 함수
async function updateUser(id, data) {
  if (data.password) {
    data.password = await hashingPassword(data.password);
  }
  const user = await userRepository.update(id, data);
  return user;
}

// 리프레시 토큰을 이용해 새로운 토큰을 생성하는 함수
async function refreshToken(userId, refreshToken) {
  const user = await userRepository.findById(userId);
  if (!user || user.refreshToken !== refreshToken) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, "refresh");
  return { accessToken, newRefreshToken };
}

// 비밀번호를 확인하는 함수
async function verifyPassword(inputPassword, savedPassword) {
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  if (!isValid) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
}

// 유저의 민감한 데이터(비밀번호, 리프레시 토큰 등)를 필터링하는 함수
function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

// JWT 토큰을 생성하는 함수
function createToken(user, type) {
  const payload = { userId: user.id };
  const options = {
    expiresIn: type === "refresh" ? "2w" : "1h",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

export default {
  createUser,
  getUser,
  getUserById,
  updateUser,
  createToken,
  refreshToken,
};
