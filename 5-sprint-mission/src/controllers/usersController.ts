import express, { Request, Response } from 'express';
import { create } from 'superstruct';
import { userService } from '../services/userService';
import { withAsyncVoid } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs';

const usersRouter = express.Router();

async function getMe(req: Request, res: Response) {
  const user = await userService.getUserProfile(req.user!.id);
  res.send(user);
}

async function updateMe(req: Request, res: Response) {
  const data = create(req.body, UpdateMeBodyStruct);
  const updatedUser = await userService.updateUserProfile(req.user!.id, data);
  res.status(200).send(updatedUser);
}

async function updateMyPassword(req: Request, res: Response) {
  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);
  await userService.updateUserPassword(req.user!.id, password, newPassword);
  res.status(200).send();
}

async function getMyProducts(req: Request, res: Response) {
  const params = create(req.query, GetMyProductListParamsStruct);
  const { products, totalCount } = await userService.getUserProducts(req.user!.id, params);
  res.send({ list: products, totalCount });
}

async function getMyFavorites(req: Request, res: Response) {
  const params = create(req.query, GetMyFavoriteListParamsStruct);
  const { products, totalCount } = await userService.getUserFavorites(req.user!.id, params);
  res.send({ list: products, totalCount });
}

usersRouter.get('/me', authenticate(), withAsyncVoid(getMe));
usersRouter.patch('/me', authenticate(), withAsyncVoid(updateMe));
usersRouter.patch('/me/password', authenticate(), withAsyncVoid(updateMyPassword));
usersRouter.get('/me/products', authenticate(), withAsyncVoid(getMyProducts));
usersRouter.get('/me/favorites', authenticate(), withAsyncVoid(getMyFavorites));

export default usersRouter;
