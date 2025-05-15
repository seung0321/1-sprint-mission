import { notificationRepository } from '../repositories/notificationRepotitory';
import { NotificationType, NotificationPayload } from '../typings/notification';

export const notificationService = {
  markAsRead: (id: number) => {
    return notificationRepository.markAsRead(id);
  },

  markAllAsRead: (userId: number) => {
    return notificationRepository.markAllAsRead(userId);
  },

  async createNotification(userId: number, type: NotificationType, payload: NotificationPayload) {
    return notificationRepository.create({ userId, type, payload });
  },
};
