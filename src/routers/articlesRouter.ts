import express from 'express';
import authenticate from '../middlewares/authenticate';
import { withAsync } from '../lib/withAsync';
import {
  createArticle,
  getArticleList,
  getArticleById,
  updateArticle,
  deleteArticle,
  createComment,
  getComments,
  likeArticle,
  unlikeArticle,
} from '../controllers/articlesController';

const articlesRouter = express.Router();

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
