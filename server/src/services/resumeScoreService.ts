import { pool } from '../config/database';

export interface ResumeScoreWithProfile {
  resume_id: number;
  score: number;
  analysis: string;
  scored_at: Date;
  user_id: number;
  name: string;
  skills: string;
  experience: string;
  education: string;
  desired_job_type: string;
  location: string;
  resume_file_url: string;
}

export const getResumeScoresWithProfiles = async (): Promise<ResumeScoreWithProfile[]> => {
  const query = `
    SELECT 
      ars.resume_id,
      ars.score,
      ars.analysis,
      ars.scored_at,
      p.user_id,
      p.name,
      p.skills,
      p.experience,
      p.education,
      p.desired_job_type,
      p.location,
      p.resume_file_url
    FROM ai_resume_scores ars
    JOIN profiles p ON ars.resume_id = p.user_id
    ORDER BY ars.score DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching resume scores with profiles:', error);
    throw error;
  }
}; 