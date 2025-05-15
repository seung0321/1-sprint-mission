import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { NotificationPayload, NotificationType } from '../typings/notification';

export const markAsRead = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await notificationService.markAsRead(id);
  return res.status(204).send();
};

export const markAllAsRead = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }
  const userId = req.user.id;
  await notificationService.markAllAsRead(userId);
  return res.status(204).send();
};

export const createNotification = async (req: Request, res: Response) => {
  const {
    userId,
    type,
    payload,
  }: { userId: number; type: NotificationType; payload: NotificationPayload } = req.body;

  const notification = await notificationService.createNotification(userId, type, payload);
  res.status(201).json(notification);
};
