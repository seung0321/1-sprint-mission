import express, { Request, Response } from 'express';
import { create } from 'superstruct';
import { UpdateCommentBodyStruct } from '../structs/commentsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { commentService } from '../services/commentService';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import BadRequestError from '../lib/errors/BadRequestError';

const commentsRouter = express.Router();

export async function updateComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  const body = create(req.body, UpdateCommentBodyStruct);

  if (!body.content || typeof body.content !== 'string') {
    throw new BadRequestError('Content is required and must be a string');
  }

  const updatedComment = await commentService.updateComment(id, req.user.id, body.content);

  return res.send(updatedComment);
}

export async function deleteComment(req: Request, res: Response) {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { id } = create(req.params, IdParamsStruct);
  await commentService.deleteComment(id, req.user.id);

  return res.status(204).send();
}
