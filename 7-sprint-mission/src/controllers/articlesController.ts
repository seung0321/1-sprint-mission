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
  const comment = await articleService.createComment(articleId, content, req.user!.id);
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
