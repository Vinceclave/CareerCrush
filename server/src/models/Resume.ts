import pool from '../config/database';

export interface Resume {
  id?: number;
  employee_id: number;
  file_url: string;
  upload_timestamp?: Date;
}

export interface AIResumeScore {
  resume_id: number;
  score: number;
  analysis: string;
  scored_at?: Date;
}

export class ResumeModel {
  static async create(resume: Resume): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO resumes (employee_id, file_url) VALUES (?, ?)',
      [resume.employee_id, resume.file_url]
    );
    return (result as any).insertId;
  }

  static async findById(id: number): Promise<Resume | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM resumes WHERE id = ?',
      [id]
    );
    return (rows as Resume[])[0] || null;
  }

  static async findByEmployeeId(employeeId: number): Promise<Resume[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM resumes WHERE employee_id = ?',
      [employeeId]
    );
    return rows as Resume[];
  }

  static async update(id: number, resume: Partial<Resume>): Promise<void> {
    const fields = Object.keys(resume).map(key => `${key} = ?`).join(', ');
    const values = Object.values(resume);
    values.push(id);

    await pool.execute(
      `UPDATE resumes SET ${fields} WHERE id = ?`,
      values
    );
  }

  static async delete(id: number): Promise<void> {
    await pool.execute(
      'DELETE FROM resumes WHERE id = ?',
      [id]
    );
  }
}

export class AIResumeScoreModel {
  static async create(score: AIResumeScore): Promise<void> {
    await pool.execute(
      'INSERT INTO ai_resume_scores (resume_id, score, analysis) VALUES (?, ?, ?)',
      [score.resume_id, score.score, score.analysis]
    );
  }

  static async findByResumeId(resumeId: number): Promise<AIResumeScore | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM ai_resume_scores WHERE resume_id = ?',
      [resumeId]
    );
    return (rows as AIResumeScore[])[0] || null;
  }

  static async update(resumeId: number, score: Partial<AIResumeScore>): Promise<void> {
    const fields = Object.keys(score).map(key => `${key} = ?`).join(', ');
    const values = Object.values(score);
    values.push(resumeId);

    await pool.execute(
      `UPDATE ai_resume_scores SET ${fields} WHERE resume_id = ?`,
      values
    );
  }

  static async delete(resumeId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM ai_resume_scores WHERE resume_id = ?',
      [resumeId]
    );
  }
} 