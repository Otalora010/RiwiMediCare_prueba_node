/**
 * User service.
 * Business logic for user management and role updates.
 */
import { AppError } from '../errors/AppError';
import { userRepository } from '../repositories/user.repository';
import { getPaginationMeta } from '../utils/pagination';
import { Role } from '../models/User';

export class UserService {
  async list(page: number, limit: number) {
    const { rows, count } = await userRepository.findAll(page, limit);
    return { data: rows, meta: getPaginationMeta(count, page, limit) };
  }

  async updateRole(id: string, role: Role, currentUserId: string) {
    if (id === currentUserId) {
      throw new AppError(409, 'No puedes cambiar tu propio rol', 'SELF_ROLE_CHANGE');
    }
    const user = await userRepository.findById(id);
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    return userRepository.updateRole(user, role);
  }

  async delete(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new AppError(409, 'No puedes eliminar tu propia cuenta', 'SELF_DELETE');
    }
    const user = await userRepository.findById(id);
    if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    await userRepository.delete(user);
  }
}

export const userService = new UserService();
