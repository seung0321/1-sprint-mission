import { NotificationData, NotificationType, NotificationPayload } from '../typings/notification';

export type NotificationRquestDTO = NotificationData;

export type NotificationResponseDTO = {
  id: number;
  userId: number;
  type: NotificationType;
  payload: NotificationPayload;
  read: boolean;
};
