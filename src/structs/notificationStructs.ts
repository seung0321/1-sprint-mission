import { number, object } from 'superstruct';

export const IdParamsStruct = object({
  id: number(),
});
