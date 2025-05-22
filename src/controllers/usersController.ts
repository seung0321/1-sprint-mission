import { Request, Response } from 'express';
import { create } from 'superstruct';
import { userService } from '../services/userService';
import {
  UpdateMeBodyStruct,
  UpdatePasswordBodyStruct,
  GetMyProductListParamsStruct,
  GetMyFavoriteListParamsStruct,
} from '../structs/usersStructs';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { CursorParamsStruct } from '../structs/commonStructs';

export async function getMe(req: Request, res: Response) {
  const user = await userService.getUserProfile(req.user!.id);
  return res.send(user);
}

export async function updateMe(req: Request, res: Response) {
  const data = create(req.body, UpdateMeBodyStruct);
  const updatedUser = await userService.updateUserProfile(req.user!.id, data);
  return res.status(200).send(updatedUser);
}

export async function updateMyPassword(req: Request, res: Response) {
  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);
  await userService.updateUserPassword(req.user!.id, password, newPassword);
  return res.status(200).send();
}

export async function getMyProducts(req: Request, res: Response) {
  const params = create(req.query, GetMyProductListParamsStruct);
  const { products, totalCount } = await userService.getUserProducts(req.user!.id, params);
  return res.status(200).send({ list: products, totalCount });
}

export async function getMyFavorites(req: Request, res: Response) {
  const params = create(req.query, GetMyFavoriteListParamsStruct);
  const { products, totalCount } = await userService.getUserFavorites(req.user!.id, params);
  return res.status(200).send({ list: products, totalCount });
}

export const getNotifications = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError('Unauthorized');

  const userId = req.user.id;
  const params = create(req.query, CursorParamsStruct);

  const { cursor, limit, keyword, orderBy } = params;

  const { notifications, nextCursor, unreadCount } = await userService.getNotifications(userId, {
    cursor,
    limit,
    keyword,
    orderBy,
  });

  return res.status(200).json({
    nextCursor,
    unreadCount,
    notifications,
  });
};
