import { Router } from 'express';
import { markAsRead, markAllAsRead } from '../controllers/notificationController';
import { withAsync } from '../lib/withAsync';
import authenticate from '../middlewares/authenticate';

const notificationrouter = Router();

notificationrouter.patch('/:id/read', authenticate(), withAsync(markAsRead));
notificationrouter.patch('/read-all', authenticate(), withAsync(markAllAsRead));

export default notificationrouter;
