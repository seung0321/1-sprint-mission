import { Request, Response, NextFunction } from 'express';

//controller에서 return 값을 명시 (이걸 사용)
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response<any>>;

export function withAsync(handler: AsyncHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}

//controller에서 return 값 제거
type AsyncHandlerVoid = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function withAsyncVoid(handler: AsyncHandlerVoid) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}
