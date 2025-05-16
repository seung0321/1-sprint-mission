import { prismaClient } from '../lib/prismaClient';
import { NotificationData } from '../typings/notification';

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

  create: (notificationData: NotificationData) => {
    return prismaClient.notification.create({ data: notificationData });
  },
};
