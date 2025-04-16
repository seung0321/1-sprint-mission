import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { create } from 'superstruct';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productsStruct';
import { IdParamsStruct } from '../structs/commonStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';

export async function createProduct(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  }
  const data = create(req.body, CreateProductBodyStruct);
  const product = await productService.createProduct(data, req.user!.id);
  return res.status(201).send(product);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const product = await productService.getProduct(id, req.user?.id);
  return res.send(product);
}

export async function updateProduct(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  }
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);
  const updatedProduct = await productService.updateProduct(id, data, req.user!.id);
  return res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  }
  const { id } = create(req.params, IdParamsStruct);
  await productService.deleteProduct(id, req.user!.id);
  return res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);
  const productList = await productService.getProductList(
    page,
    pageSize,
    orderBy ?? 'recent',
    keyword,
  );
  return res.send(productList);
}

export async function createComment(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  }
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const comment = await productService.createComment(productId, content, req.user!.id);
  return res.status(201).send(comment);
}

export async function getComments(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);
  const comments = await productService.getComments(productId, cursor, limit);
  return res.send(comments);
}

export async function addFavorite(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  }
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.addFavorite(productId, req.user!.id);
  return res.status(201).send();
}

export async function removeFavorite(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).send({ message: 'Unauthorized' });
  }
  const { id: productId } = create(req.params, IdParamsStruct);
  await productService.removeFavorite(productId, req.user!.id);
  return res.status(204).send();
}
