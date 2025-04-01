import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User | null; // Prisma에서 제공하는 User 타입 사용
    }
  }
}
