import { Profile, ProfileModel } from '../models/Profile';
import { UserService } from './UserService';

export class ProfileService {
  static async createProfile(userId: number, profileData: Partial<Profile>): Promise<void> {
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const profile: Profile = {
      user_id: userId,
      ...profileData
    };

    await ProfileModel.create(profile);
  }

  static async getProfile(userId: number): Promise<Profile | null> {
    return ProfileModel.findByUserId(userId);
  }

  static async updateProfile(userId: number, updates: Partial<Profile>): Promise<void> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    await ProfileModel.update(userId, updates);
  }

  static async deleteProfile(userId: number): Promise<void> {
    await ProfileModel.delete(userId);
  }
} 