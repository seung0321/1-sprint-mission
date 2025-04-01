import { Request, Response, NextFunction } from 'express';

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

type AsyncHandlerVoid = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function withAsyncVoid(handler: AsyncHandlerVoid) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next); // handler가 next()를 호출하게 됨
    } catch (e) {
      next(e); // 오류 처리
    }
  };
}
