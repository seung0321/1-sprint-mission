import express from 'express';
import { withAsync, withAsyncVoid } from '../lib/withAsync';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
  createFavorite,
  deleteFavorite,
} from '../controllers/productsController';
import authenticate from '../middlewares/authenticate';

const productsRouter = express.Router();

productsRouter.post('/', authenticate(), withAsyncVoid(createProduct));
productsRouter.get('/:id', authenticate({ optional: true }), withAsync(getProduct));
productsRouter.patch('/:id', authenticate(), withAsync(updateProduct));
productsRouter.delete('/:id', authenticate(), withAsync(deleteProduct));
productsRouter.get('/', authenticate({ optional: true }), withAsync(getProductList));
productsRouter.post('/:id/comments', authenticate(), withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));
productsRouter.post('/:id/favorites', authenticate(), withAsync(createFavorite));
productsRouter.delete('/:id/favorites', authenticate(), withAsync(deleteFavorite));

export default productsRouter;
