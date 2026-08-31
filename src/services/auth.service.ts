import { AppError } from '../errors/AppError';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { Role, User } from '../models/User';
import { userRepository } from '../repositories/user.repository';
import { createAccessToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';

const toPublicUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/** Centraliza registro, credenciales y emisión de JWT. */
export class AuthService {
  async register(input: RegisterDto) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'El correo ya está registrado', 'EMAIL_IN_USE');

    const password = await hashPassword(input.password);
    const role = input.role && Object.values(Role).includes(input.role as Role) ? (input.role as Role) : Role.GESTOR;
    const user = await userRepository.create({ name: input.name, email: input.email, password, role } as unknown as Pick<User, 'name' | 'email' | 'password'> & { role: Role });
    return this.buildSession(user);
  }

  async login(input: LoginDto) {
    const user = await userRepository.findByEmail(input.email, true);
    if (!user || !(await comparePassword(input.password, user.password))) {
      throw new AppError(401, 'Credenciales incorrectas', 'INVALID_CREDENTIALS');
    }
    if (!user.isActive) throw new AppError(403, 'La cuenta está inactiva', 'INACTIVE_ACCOUNT');

    return this.buildSession(user);
  }

  async me(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError(404, 'Usuario no encontrado', 'USER_NOT_FOUND');
    return toPublicUser(user);
  }

  private buildSession(user: User) {
    const token = createAccessToken({ id: user.id, email: user.email, role: user.role as Role });
    return { user: toPublicUser(user), token };
  }
}

export const authService = new AuthService();
