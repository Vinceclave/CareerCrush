import { User, UserModel } from '../models/User';
import bcrypt from 'bcrypt';

export class UserService {
  static async createUser(email: string, password: string, role: 'employee' | 'employer'): Promise<number> {
    const passwordHash = await bcrypt.hash(password, 10);
    return UserModel.create({ email, password_hash: passwordHash, role });
  }

  static async getUserById(id: number): Promise<User | null> {
    return UserModel.findById(id);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return UserModel.findByEmail(email);
  }

  static async updateUser(id: number, updates: Partial<User>): Promise<void> {
    if (updates.password_hash) {
      updates.password_hash = await bcrypt.hash(updates.password_hash, 10);
    }
    await UserModel.update(id, updates);
  }

  static async deleteUser(id: number): Promise<void> {
    await UserModel.delete(id);
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }
} 