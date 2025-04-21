import axios from 'axios';
import { authService } from './authService';

// Use Vite environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface BaseProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  resume_url?: string;
  created_at: string;
  updated_at: string;
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

export interface Resume {
  id: string;
  employee_id: string;
  file_url: string;
  upload_timestamp: string;
}

export interface ResumeScore {
  resume_id: number;
  score: number;
  analysis: string;
  scored_at: string;
}

export const profileService = {
  async getProfile(): Promise<BaseProfile> {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  },

  async createProfile(profileData: Partial<BaseProfile>): Promise<BaseProfile> {
    const response = await axios.post(`${API_URL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  },

  async updateProfile(profileData: Partial<BaseProfile>): Promise<BaseProfile> {
    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  },

  async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await axios.post(`${API_URL}/profile/resume`, formData, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async getResumes(): Promise<Resume[]> {
    const response = await axios.get(`${API_URL}/profile/resume`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  },

  isEmployeeProfile(profile: Profile): profile is EmployeeProfile {
    return 'skills' in profile;
  },

  isEmployerProfile(profile: Profile): profile is EmployerProfile {
    return 'company_name' in profile;
  },

  async analyzeResume(resumeId: number, jobDescription: string): Promise<ResumeScore> {
    const response = await axios.post(
      `${API_URL}/profile/resume/analyze`,
      { resume_id: resumeId, job_description: jobDescription },
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        }
      }
    );
    return response.data;
  },

  async getResumeScore(resumeId: number): Promise<ResumeScore> {
    const response = await axios.get(`${API_URL}/profile/resume/${resumeId}/score`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  }
}; 