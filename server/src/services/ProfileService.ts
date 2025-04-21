import { Profile, ProfileModel, EmployeeProfile, EmployerProfile } from '../models/Profile';
import { UserService } from './UserService';

export class ProfileService {
  static async createProfile(userId: number, profileData: Partial<Profile>): Promise<number> {
    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate profile data based on user role
    if (user.role === 'employee') {
      const employeeData = profileData as Partial<EmployeeProfile>;
      this.validateEmployeeProfile(employeeData);
      const employeeProfile: EmployeeProfile = {
        user_id: userId,
        first_name: employeeData.first_name || '',
        last_name: employeeData.last_name || '',
        skills: employeeData.skills || [],
        ...employeeData
      };
      return ProfileModel.create(employeeProfile);
    } else {
      const employerData = profileData as Partial<EmployerProfile>;
      this.validateEmployerProfile(employerData);
      const employerProfile: EmployerProfile = {
        user_id: userId,
        first_name: employerData.first_name || '',
        last_name: employerData.last_name || '',
        company_name: employerData.company_name || '',
        industry: employerData.industry || '',
        ...employerData
      };
      return ProfileModel.create(employerProfile);
    }
  }

  static async getProfile(userId: number): Promise<Profile | null> {
    return ProfileModel.findByUserId(userId);
  }

  static async updateProfile(userId: number, updates: Partial<Profile>): Promise<void> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate updates based on user role
    if (user.role === 'employee') {
      this.validateEmployeeProfile(updates as Partial<EmployeeProfile>);
    } else {
      this.validateEmployerProfile(updates as Partial<EmployerProfile>);
    }

    await ProfileModel.update(userId, updates);
  }

  static async deleteProfile(userId: number): Promise<void> {
    await ProfileModel.delete(userId);
  }

  private static validateEmployeeProfile(profile: Partial<EmployeeProfile>): void {
    if (profile.skills && !Array.isArray(profile.skills)) {
      throw new Error('Skills must be an array');
    }

    if (profile.preferred_job_type && 
        !['full-time', 'part-time', 'contract', 'internship'].includes(profile.preferred_job_type)) {
      throw new Error('Invalid job type');
    }

    if (profile.preferred_work_environment && 
        !['remote', 'hybrid', 'on-site'].includes(profile.preferred_work_environment)) {
      throw new Error('Invalid work environment');
    }

    if (profile.experience_years !== undefined) {
      // Convert to number if it's a string
      const years = typeof profile.experience_years === 'string' 
        ? parseFloat(profile.experience_years)
        : profile.experience_years;

      if (isNaN(years) || years < 0) {
        throw new Error('Experience years must be a non-negative number');
      }
    }
  }

  private static validateEmployerProfile(profile: Partial<EmployerProfile>): void {
    if (profile.company_name && typeof profile.company_name !== 'string') {
      throw new Error('Company name must be a string');
    }

    if (profile.company_website && !this.isValidUrl(profile.company_website)) {
      throw new Error('Invalid company website URL');
    }

    if (profile.company_logo_url && !this.isValidUrl(profile.company_logo_url)) {
      throw new Error('Invalid company logo URL');
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 