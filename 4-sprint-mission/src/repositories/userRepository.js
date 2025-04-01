import prisma from "../config/prisma.js";

// ID로 특정 사용자를 조회하는 함수
async function findById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

// 이메일로 특정 사용자를 조회하는 함수
async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    orderBy: { createdAt: "asc" },
  });
}

// 새로운 사용자를 저장하는 함수
async function save(user) {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      image: user.image, // 이미지 경로 포함
    },
  });
}

// 특정 사용자의 정보를 업데이트하는 함수
async function update(id, data) {
  return prisma.user.update({
    where: {
      id,
    },
    data: data,
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
};
