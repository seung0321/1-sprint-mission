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
  getUnreadCount,
} from '../controllers/usersController';

const usersRouter = express.Router();

usersRouter.get('/me', authenticate(), withAsync(getMe));
usersRouter.patch('/me', authenticate(), withAsync(updateMe));
usersRouter.patch('/me/password', authenticate(), withAsync(updateMyPassword));
usersRouter.get('/me/products', authenticate(), withAsync(getMyProducts));
usersRouter.get('/me/favorites', authenticate(), withAsync(getMyFavorites));
usersRouter.get('/notification', authenticate(), withAsync(getNotifications));
usersRouter.get('/unread-count', authenticate(), withAsync(getUnreadCount));

export default usersRouter;
