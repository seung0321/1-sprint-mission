import express, { Request, Response } from 'express';
import { withAsyncVoid } from '../lib/withAsync';
import { productService } from '../services/productService';
import authenticate from '../middlewares/authenticate';
import { create } from 'superstruct';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';

const productsRouter = express.Router();

async function createProduct(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const data = create(req.body, CreateProductBodyStruct);
  const product = await productService.createProduct(data, req.user.id);
  res.status(201).send(product);
}

async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getProduct(id, req.user?.id);
  res.send(product);
}

async function updateProduct(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const updatedProduct = await productService.updateProduct(id, data, req.user.id);
  res.send(updatedProduct);
}

async function deleteProduct(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id, req.user.id);
  res.status(204).send();
}

async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);
  const productList = await productService.getProductList(
    page,
    pageSize,
    orderBy ?? 'recent',
    keyword,
  );
  res.send(productList);
}

async function createComment(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const comment = await productService.createComment(productId, content, req.user.id);
  res.status(201).send(comment);
}

async function getComments(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const comments = await productService.getComments(productId, cursor, limit);
  res.send(comments);
}

async function addFavorite(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.addFavorite(productId, req.user.id);
  res.status(201).send();
}

async function removeFavorite(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.removeFavorite(productId, req.user.id);
  res.status(204).send();
}

// 라우트 정의
productsRouter.post('/', authenticate(), withAsyncVoid(createProduct));
productsRouter.get('/:id', authenticate({ optional: true }), withAsyncVoid(getProduct));
productsRouter.patch('/:id', authenticate(), withAsyncVoid(updateProduct));
productsRouter.delete('/:id', authenticate(), withAsyncVoid(deleteProduct));
productsRouter.get('/', authenticate({ optional: true }), withAsyncVoid(getProductList));
productsRouter.post('/:id/comments', authenticate(), withAsyncVoid(createComment));
productsRouter.get('/:id/comments', withAsyncVoid(getComments));
productsRouter.post('/:id/favorites', authenticate(), withAsyncVoid(addFavorite));
productsRouter.delete('/:id/favorites', authenticate(), withAsyncVoid(removeFavorite));

export default productsRouter;
