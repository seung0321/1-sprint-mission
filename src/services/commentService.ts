import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { commentRepository } from '../repositories/commentRepository';

export const commentService = {
  async updateComment(id: number, userId: number, content: string) {
    const existingComment = await commentRepository.findCommentById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    return commentRepository.updateComment(id, content);
  },

  async deleteComment(id: number, userId: number) {
    const existingComment = await commentRepository.findCommentById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    return commentRepository.deleteComment(id);
  },
};
