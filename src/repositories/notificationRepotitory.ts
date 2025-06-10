import { prismaClient } from '../lib/prismaClient';
import { NotificationData } from '../typings/notification';

export const notificationRepository = {
  markAsRead: (id: number) => {
    return prismaClient.notification.update({
      where: { id },
      data: { is_read: true },
    });
  },

  markAllAsRead: (userId: number) => {
    return prismaClient.notification.updateMany({
      where: { userId, is_read: false },
      data: { is_read: true },
    });
  },

  create: (notificationData: NotificationData) => {
    return prismaClient.notification.create({ data: notificationData });
  },
};
