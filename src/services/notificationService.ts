import { notificationRepository } from '../repositories/notificationRepotitory';
import { NotificationData } from '../typings/notification';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export const notificationService = {
  markAsRead: (id: number) => {
    return notificationRepository.markAsRead(id);
  },

  markAllAsRead: (user: { id: number } | undefined) => {
    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }

    return notificationRepository.markAllAsRead(user.id);
  },

  async createNotification(input: NotificationData) {
    return notificationRepository.create(input);
  },
};
