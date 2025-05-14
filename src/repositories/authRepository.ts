import { prismaClient } from '../lib/prismaClient';

async function findUserByEmail(email: string) {
  return prismaClient.user.findUnique({ where: { email } });
}

async function findUserById(id: number) {
  return prismaClient.user.findUnique({ where: { id } });
}

async function createUser(email: string, nickname: string, password: string) {
  return prismaClient.user.create({
    data: { email, nickname, password },
  });
}

export const authRepository = {
  findUserByEmail,
  findUserById,
  createUser,
};
