import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:3000/api';

export interface BaseProfile {
  id?: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
}

export interface EmployeeProfile extends BaseProfile {
  title?: string;
  skills: string[];
  experience_years?: number;
  education?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  bio?: string;
  preferred_location?: string;
  preferred_job_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  preferred_work_environment?: 'remote' | 'hybrid' | 'on-site';
}

export interface EmployerProfile extends BaseProfile {
  company_name: string;
  company_website?: string;
  industry: string;
  company_size?: string;
  company_description?: string;
  company_logo_url?: string;
  location?: string;
}

export type Profile = EmployeeProfile | EmployerProfile;

class ProfileService {
  private getAuthHeader() {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getProfile(): Promise<Profile> {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  async createProfile(profileData: Partial<Profile>): Promise<number> {
    const response = await axios.post(`${API_URL}/profile`, profileData, {
      headers: this.getAuthHeader()
    });
    return response.data.profileId;
  }

  async updateProfile(updates: Partial<Profile>): Promise<void> {
    await axios.put(`${API_URL}/profile`, updates, {
      headers: this.getAuthHeader()
    });
  }

  async deleteProfile(): Promise<void> {
    await axios.delete(`${API_URL}/profile`, {
      headers: this.getAuthHeader()
    });
  }

  isEmployeeProfile(profile: Profile): profile is EmployeeProfile {
    return 'skills' in profile;
  }

  isEmployerProfile(profile: Profile): profile is EmployerProfile {
    return 'company_name' in profile;
  }
}

export const profileService = new ProfileService(); 