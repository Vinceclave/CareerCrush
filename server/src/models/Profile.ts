import pool from '../config/database';

export interface Profile {
  user_id: number;
  name?: string;
  skills?: string;
  experience?: string;
  education?: string;
  desired_job_type?: string;
  company_name?: string;
  job_title?: string;
  job_description?: string;
  location?: string;
  resume_score?: number;
  resume_file_url?: string;
}

export class ProfileModel {
  static async create(profile: Profile): Promise<void> {
    const fields = Object.keys(profile).join(', ');
    const placeholders = Object.keys(profile).map(() => '?').join(', ');
    const values = Object.values(profile);

    await pool.execute(
      `INSERT INTO profiles (${fields}) VALUES (${placeholders})`,
      values
    );
  }

  static async findByUserId(userId: number): Promise<Profile | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );
    return (rows as Profile[])[0] || null;
  }

  static async update(userId: number, profile: Partial<Profile>): Promise<void> {
    const fields = Object.keys(profile).map(key => `${key} = ?`).join(', ');
    const values = Object.values(profile);
    values.push(userId);

    await pool.execute(
      `UPDATE profiles SET ${fields} WHERE user_id = ?`,
      values
    );
  }

  static async delete(userId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM profiles WHERE user_id = ?',
      [userId]
    );
  }
} 