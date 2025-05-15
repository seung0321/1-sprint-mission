export type NotificationType = 'price_fluctuation' | 'create_comment';

export type PriceFluctuationPayload = {
  productId: number;
  oldPrice: number;
  newPrice: number;
};

export type CreateCommentPayload = {
  articleId: number;
  commentId: number;
  content: string;
};

export type NotificationPayload = PriceFluctuationPayload | CreateCommentPayload;

export interface NotificationResponse {
  userId: number;
  type: NotificationType;
  payload: NotificationPayload;
  read: boolean;
}
