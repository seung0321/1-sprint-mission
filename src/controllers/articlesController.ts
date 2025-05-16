import { prismaClient } from '../lib/prismaClient';
import { Request, Response } from 'express';
import { create } from 'superstruct';
import { articleService } from '../services/articleService';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { userSockets, io } from '../services/socketService';
import { notificationService } from '../services/notificationService';
import { NotificationType } from '@prisma/client';

export const createArticle = async (req: Request, res: Response) => {
  const { title, content } = create(req.body, CreateArticleBodyStruct);
  const article = await articleService.createArticle(title, content, req.user!.id);
  return res.status(201).send(article);
};

export const getArticleList = async (req: Request, res: Response) => {
  const {
    page,
    pageSize,
    orderBy = 'recent',
    keyword,
  } = create(req.query, GetArticleListParamsStruct);
  const result = await articleService.getArticleList(page, pageSize, orderBy, keyword);
  return res.send(result);
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getArticleById(id);
  return res.send(article);
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updatedArticle = await articleService.updateArticle(id, req.user!.id, data);
  return res.send(updatedArticle);
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id, req.user!.id);
  return res.status(204).send();
};

export const createComment = async (req: Request, res: Response) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  // 댓글 생성
  const comment = await articleService.createComment(articleId, content, req.user!.id);

  // 게시글 작성자 ID 조회 (예: articleService에서 article.userId 반환)
  const article = await prismaClient.article.findUnique({
    where: { id: articleId },
    select: { userId: true },
  });

  if (article && article.userId !== req.user!.id) {
    const payload = {
      articleId,
      commentId: comment.id,
      content, // 댓글 내용도 payload에 포함할 수 있음
    };

    // 🔸 1. 알림 DB 저장
    await notificationService.createNotification({
      userId: article.userId,
      type: NotificationType.create_comment,
      payload,
    });

    // 🔸 2. 실시간 알림 전송
    const targetSocketId = userSockets.get(article.userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('notification', {
        type: NotificationType.create_comment,
        payload,
      });
    }
  }

  return res.status(201).send(comment);
};

export const getComments = async (req: Request, res: Response) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const comments = await articleService.getComments(articleId, cursor, limit);
  return res.send(comments);
};

export const likeArticle = async (req: Request, res: Response) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articleService.likeArticle(articleId, req.user!.id);
  return res.status(201).send();
};

export const unlikeArticle = async (req: Request, res: Response) => {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articleService.unlikeArticle(articleId, req.user!.id);
  return res.status(204).send();
};
