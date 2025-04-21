import { Resume, ResumeModel, AIResumeScore, AIResumeScoreModel } from '../models/Resume';
import { UserService } from './UserService';

export class ResumeService {
  static async uploadResume(employeeId: number, fileUrl: string): Promise<number> {
    const user = await UserService.getUserById(employeeId);
    if (!user || user.role !== 'employee') {
      throw new Error('Invalid employee ID');
    }

    const resume: Resume = {
      employee_id: employeeId,
      file_url: fileUrl
    };

    return ResumeModel.create(resume);
  }

  static async getResumeById(id: number): Promise<Resume | null> {
    return ResumeModel.findById(id);
  }

  static async getResumesByEmployeeId(employeeId: number): Promise<Resume[]> {
    return ResumeModel.findByEmployeeId(employeeId);
  }

  static async updateResume(id: number, updates: Partial<Resume>): Promise<void> {
    const resume = await this.getResumeById(id);
    if (!resume) {
      throw new Error('Resume not found');
    }

    await ResumeModel.update(id, updates);
  }

  static async deleteResume(id: number): Promise<void> {
    await ResumeModel.delete(id);
  }

  static async addAIResumeScore(resumeId: number, score: number, analysis: string): Promise<void> {
    const resume = await this.getResumeById(resumeId);
    if (!resume) {
      throw new Error('Resume not found');
    }

    const aiScore: AIResumeScore = {
      resume_id: resumeId,
      score,
      analysis
    };

    await AIResumeScoreModel.create(aiScore);
  }

  static async getAIResumeScore(resumeId: number): Promise<AIResumeScore | null> {
    return AIResumeScoreModel.findByResumeId(resumeId);
  }

  static async updateAIResumeScore(resumeId: number, updates: Partial<AIResumeScore>): Promise<void> {
    const score = await this.getAIResumeScore(resumeId);
    if (!score) {
      throw new Error('AI resume score not found');
    }

    await AIResumeScoreModel.update(resumeId, updates);
  }

  static async deleteAIResumeScore(resumeId: number): Promise<void> {
    await AIResumeScoreModel.delete(resumeId);
  }
} 