import { prismaClient } from '../lib/prismaClient';

export const commentRepository = {
  async findCommentById(id: number) {
    return prismaClient.comment.findUnique({ where: { id } });
  },

  async updateComment(id: number, content: string) {
    return prismaClient.comment.update({
      where: { id },
      data: { content },
    });
  },

  async deleteComment(id: number) {
    return prismaClient.comment.delete({ where: { id } });
  },
};
