import { prismaClient } from '../lib/prismaClient';
import { NotificationPayload, NotificationType } from '../typings/notification';
export const notificationRepository = {
  markAsRead: (id: number) => {
    return prismaClient.notification.update({
      where: { id },
      data: { read: true },
    });
  },

  markAllAsRead: (userId: number) => {
    return prismaClient.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },

  create: (data: { userId: number; type: NotificationType; payload: NotificationPayload }) => {
    return prismaClient.notification.create({ data });
  },
};
