/**
 * User repository.
 * Data access layer for User entity.
 */
import { User } from '../models/User';

export class UserRepository {
  findByEmail(email: string, withPassword = false): Promise<User | null> {
    const model = withPassword ? User.scope('withPassword') : User;
    return model.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  create(data: Pick<User, 'name' | 'email' | 'password'> & { role?: User['role'] }): Promise<User> {
    return User.create(data as unknown as Pick<User, 'name' | 'email' | 'password'>);
  }

  async findAll(page: number, limit: number) {
    return User.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
  }

  async updateRole(user: User, role: User['role']): Promise<User> {
    return user.update({ role });
  }

  async delete(user: User): Promise<void> {
    await user.destroy();
  }
}

export const userRepository = new UserRepository();
