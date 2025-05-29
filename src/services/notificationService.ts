import { notificationRepository } from '../repositories/notificationRepotitory';
import { NotificationData } from '../typings/notification';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export const notificationService = {
  async markAsRead(id: number) {
    return await notificationRepository.markAsRead(id);
  },

  async markAllAsRead(user: { id: number } | undefined) {
    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }

    return await notificationRepository.markAllAsRead(user.id);
  },

  async createNotification(input: NotificationData) {
    return await notificationRepository.create(input);
  },
};
