import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import { NotificationPayload } from '../typings/notification';
import { NotificationRquestDTO, NotificationResponseDTO } from '../dto/notification.dto';
import { NotificationInputStruct } from '../structs/notificationStruct';
import { create } from 'superstruct';

export const markAsRead = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await notificationService.markAsRead(id);
  return res.status(204).send();
};

export const markAllAsRead = async (req: Request, res: Response) => {
  await notificationService.markAllAsRead(req.user);
  return res.status(204).send();
};

export const createNotification = async (req: Request, res: Response) => {
  const notificationRequest: NotificationRquestDTO = create(req.body, NotificationInputStruct);

  const rawNotification = await notificationService.createNotification(notificationRequest);

  const NotificationResponse: NotificationResponseDTO = {
    ...rawNotification,
    payload: rawNotification.payload as NotificationPayload,
  };

  return res.status(201).json(NotificationResponse);
};
