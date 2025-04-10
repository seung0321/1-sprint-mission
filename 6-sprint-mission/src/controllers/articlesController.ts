import express, { Request, Response } from 'express';
import { create } from 'superstruct';
import authenticate from '../middlewares/authenticate';
import { withAsync } from '../lib/withAsync';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { articleService } from '../services/articleService';

const articlesRouter = express.Router();

async function createArticle(req: Request, res: Response) {
  const { title, content } = create(req.body, CreateArticleBodyStruct);
  const article = await articleService.createArticle(title, content, req.user!.id);
  return res.status(201).send(article);
}

async function getArticleList(req: Request, res: Response) {
  const {
    page,
    pageSize,
    orderBy = 'recent',
    keyword,
  } = create(req.query, GetArticleListParamsStruct);
  const result = await articleService.getArticleList(page, pageSize, orderBy, keyword);
  return res.send(result);
}

async function getArticleById(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getArticleById(id);
  return res.send(article);
}

async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const updatedArticle = await articleService.updateArticle(id, req.user!.id, data);
  return res.send(updatedArticle);
}

async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await articleService.deleteArticle(id, req.user!.id);
  return res.status(204).send();
}

async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const comment = await articleService.createComment(articleId, content, req.user!.id);
  return res.status(201).send(comment);
}

async function getComments(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const comments = await articleService.getComments(articleId, cursor, limit);
  return res.send(comments);
}

async function likeArticle(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articleService.likeArticle(articleId, req.user!.id);
  return res.status(201).send();
}

async function unlikeArticle(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  await articleService.unlikeArticle(articleId, req.user!.id);
  return res.status(204).send();
}

articlesRouter.post('/', authenticate(), withAsync(createArticle));
articlesRouter.get('/', authenticate({ optional: true }), withAsync(getArticleList));
articlesRouter.get('/:id', authenticate({ optional: true }), withAsync(getArticleById));
articlesRouter.patch('/:id', authenticate(), withAsync(updateArticle));
articlesRouter.delete('/:id', authenticate(), withAsync(deleteArticle));
articlesRouter.post('/:id/comments', authenticate(), withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getComments));
articlesRouter.post('/:id/likes', authenticate(), withAsync(likeArticle));
articlesRouter.delete('/:id/likes', authenticate(), withAsync(unlikeArticle));

export default articlesRouter;
