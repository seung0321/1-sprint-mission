import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction): void {
  res.status(404).json({ message: 'Not Found' });
}

// Express의 에러 핸들러 미들웨어 타입 적용
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // From superstruct or application error
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).json({ message: err.message });
    return;
  }

  // From express middleware
  if (err instanceof SyntaxError && 'body' in err) {
    const error = err as SyntaxError & { status?: number };
    if (error.status === 400) {
      res.status(400).json({ message: 'Invalid JSON' });
      return;
    }
  }

  // Prisma error codes
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process data' });
    return;
  }

  // Application errors
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: err.message });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(403).json({ message: err.message });
    return;
  }

  // Fallback for unexpected errors
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};
