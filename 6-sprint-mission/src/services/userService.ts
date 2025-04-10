import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizedError from '../lib/errors/UnauthorizedError';

export const userService = {
  async getUserProfile(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('user', userId);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updateUserProfile(userId: number, data: any) {
    const updatedUser = await userRepository.updateUser(userId, data);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async updateUserPassword(userId: number, password: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('user', userId);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid credentials');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userRepository.updatePassword(userId, hashedPassword);
  },

  async getUserProducts(userId: number, params: any) {
    const { page, pageSize, orderBy, keyword } = params;
    const where = keyword
      ? { OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }] }
      : {};
    return userRepository.getUserProducts(
      userId,
      where,
      (page - 1) * pageSize,
      pageSize,
      orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    );
  },

  async getUserFavorites(userId: number, params: any) {
    const { page, pageSize, orderBy, keyword } = params;
    const where = keyword
      ? { OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }] }
      : {};
    return userRepository.getUserFavoriteProducts(
      userId,
      where,
      (page - 1) * pageSize,
      pageSize,
      orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    );
  },
};
