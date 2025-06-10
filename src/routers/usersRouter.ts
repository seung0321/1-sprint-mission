import express from 'express';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';
import {
  getMe,
  updateMe,
  updateMyPassword,
  getMyProducts,
  getMyFavorites,
  getNotifications,
} from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.get('/me', authenticate(), withAsync(getMe));
usersRouter.patch('/me', authenticate(), withAsync(updateMe));
usersRouter.patch('/me/password', authenticate(), withAsync(updateMyPassword));
usersRouter.get('/me/products', authenticate(), withAsync(getMyProducts));
usersRouter.get('/me/favorites', authenticate(), withAsync(getMyFavorites));
usersRouter.get('/notification', authenticate(), withAsync(getNotifications));

export default usersRouter;
