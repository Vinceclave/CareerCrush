import axios from 'axios';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Candidate {
  resume_id: number;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  score: number;
  analysis: string;
  scored_at: string;
  match_percentage: string;
}

export interface CandidateResponse {
  candidates: Candidate[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export const employerService = {
  async getMatchingCandidates(minScore: number = 0.6, limit: number = 10, offset: number = 0): Promise<CandidateResponse> {
    const response = await axios.get(`${API_URL}/employer/search-candidates`, {
      params: { min_score: minScore, limit, offset },
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  },

  async getCandidateAnalysis(resumeId: number) {
    const response = await axios.get(`${API_URL}/employer/resume/${resumeId}/analysis`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  },

  async getTopSkills(limit: number = 20) {
    const response = await axios.get(`${API_URL}/employer/top-skills`, {
      params: { limit },
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    });
    return response.data;
  }
}; 