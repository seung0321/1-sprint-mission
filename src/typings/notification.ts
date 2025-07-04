export type NotificationType = 'PRICE_FLUCTUATION' | 'CREATE_COMMENT';

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

export interface NotificationData {
  userId: number;
  type: NotificationType;
  payload: NotificationPayload;
}
