import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client'; // Prisma 관련 타입을 임포트

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction) {
  return res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  /** From superstruct or application error */
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).send({ message: err.message });
  }

  /** From expresson middleware */
  if (err instanceof SyntaxError && 'body' in err) {
    // Cast err to `any` to access `status` property
    const error = err as SyntaxError & { status?: number };
    if (error.status === 400) {
      return res.status(400).send({ message: 'Invalid JSON' });
    }
  }

  /** Prisma error codes */
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors, e.g., code can be 'P2002', 'P2025', etc.
    console.error(err);
    return res.status(500).send({ message: 'Failed to process data' });
  }

  /** Application errors */
  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).send({ message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).send({ message: err.message });
  }

  console.error(err);
  return res.status(500).send({ message: 'Internal server error' });
}
