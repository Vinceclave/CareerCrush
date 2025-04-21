import { ResumeModel, Resume, AIResumeScore } from '../models/Resume';
import { UserService } from './UserService';

export class ResumeService {
  static async uploadResume(employeeId: number, fileUrl: string): Promise<Resume> {
    const user = await UserService.getUserById(employeeId);
    if (!user || user.role !== 'employee') {
      throw new Error('Invalid employee ID');
    }

    const resumeData = {
      employee_id: employeeId,
      file_url: fileUrl
    };
    return ResumeModel.create(resumeData);
  }

  static async getResumesByEmployeeId(employeeId: number): Promise<Resume[]> {
    return ResumeModel.findByEmployeeId(employeeId);
  }

  static async getResumeById(id: number): Promise<Resume | null> {
    return ResumeModel.findById(id);
  }

  static async deleteResume(id: number): Promise<void> {
    await ResumeModel.delete(id);
  }

  static async analyzeResume(resumeId: number, jobDescription: string): Promise<AIResumeScore> {
    return ResumeModel.analyzeResume(resumeId, jobDescription);
  }

  static async getResumeScore(resumeId: number): Promise<AIResumeScore | null> {
    return ResumeModel.getResumeScore(resumeId);
  }
} 