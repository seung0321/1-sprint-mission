import { object, number, string, union, literal } from 'superstruct';

const PriceFluctuationPayloadStruct = object({
  productId: number(),
  oldPrice: number(),
  newPrice: number(),
});

const CreateCommentPayloadStruct = object({
  articleId: number(),
  commentId: number(),
  content: string(),
});

export const NotificationTypeStruct = union([
  literal('PRICE_FLUCTUATION'),
  literal('CREATE_COMMENT'),
]);

export const NotificationPayloadStruct = union([
  PriceFluctuationPayloadStruct,
  CreateCommentPayloadStruct,
]);

export const NotificationInputStruct = object({
  userId: number(),
  type: NotificationTypeStruct,
  payload: NotificationPayloadStruct,
});
