import { User, UserModel } from '../models/User';
import { ProfileService } from './ProfileService';
import bcrypt from 'bcrypt';

export class UserService {
  static async createUser(email: string, password: string, role: 'employee' | 'employer'): Promise<number> {
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await UserModel.create({ email, password_hash: passwordHash, role });

    // Create a default profile based on the user's role
    const defaultProfile = role === 'employee' 
      ? {
          first_name: '',
          last_name: '',
          skills: [],
          preferred_job_type: 'full-time',
          preferred_work_environment: 'remote'
        }
      : {
          first_name: '',
          last_name: '',
          company_name: '',
          industry: ''
        };

    await ProfileService.createProfile(userId, defaultProfile);

    return userId;
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