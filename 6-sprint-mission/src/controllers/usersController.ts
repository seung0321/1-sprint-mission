import express, { Request, Response } from 'express';
import { create } from 'superstruct';
import { userService } from '../services/userService';
import { withAsync } from '../lib/withAsync';
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
  return res.send(user);
}

async function updateMe(req: Request, res: Response) {
  const data = create(req.body, UpdateMeBodyStruct);
  const updatedUser = await userService.updateUserProfile(req.user!.id, data);
  return res.status(200).send(updatedUser);
}

async function updateMyPassword(req: Request, res: Response) {
  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);
  await userService.updateUserPassword(req.user!.id, password, newPassword);
  return res.status(200).send();
}

async function getMyProducts(req: Request, res: Response) {
  const params = create(req.query, GetMyProductListParamsStruct);
  const { products, totalCount } = await userService.getUserProducts(req.user!.id, params);
  return res.send({ list: products, totalCount });
}

async function getMyFavorites(req: Request, res: Response) {
  const params = create(req.query, GetMyFavoriteListParamsStruct);
  const { products, totalCount } = await userService.getUserFavorites(req.user!.id, params);
  return res.send({ list: products, totalCount });
}

usersRouter.get('/me', authenticate(), withAsync(getMe));
usersRouter.patch('/me', authenticate(), withAsync(updateMe));
usersRouter.patch('/me/password', authenticate(), withAsync(updateMyPassword));
usersRouter.get('/me/products', authenticate(), withAsync(getMyProducts));
usersRouter.get('/me/favorites', authenticate(), withAsync(getMyFavorites));

export default usersRouter;
