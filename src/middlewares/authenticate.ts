import { prismaClient } from '../lib/prismaClient';
import { verifyAccessToken } from '../lib/token';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

interface AuthenticateOptions {
  optional?: boolean;
}

function authenticate(options: AuthenticateOptions = { optional: false }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken) {
      if (options.optional) {
        return next();
      }
      return next(new UnauthorizedError('Unauthorized'));
    }

    try {
      const { userId } = verifyAccessToken(accessToken);
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      if (!user) {
        return next(new UnauthorizedError('Unauthorized'));
      }
      req.user = user;
      next();
    } catch (error) {
      if (options.optional) {
        return next();
      }
      return next(new UnauthorizedError('Unauthorized'));
    }
  };
}

export default authenticate;
