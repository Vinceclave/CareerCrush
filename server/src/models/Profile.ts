import pool from '../config/database';

export interface BaseProfile {
  id?: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
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

export class ProfileModel {
  static async create(profile: Profile): Promise<number> {
    const { user_id, ...profileData } = profile;
    const processedData = this.processProfileData(profileData);
    const fields = Object.keys(processedData).join(', ');
    const placeholders = Object.keys(processedData).map(() => '?').join(', ');
    const values = Object.values(processedData);

    const [result] = await pool.execute(
      `INSERT INTO profiles (user_id, ${fields}) VALUES (?, ${placeholders})`,
      [user_id, ...values]
    );
    return (result as any).insertId;
  }

  static async findByUserId(userId: number): Promise<Profile | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM profiles WHERE user_id = ?',
      [userId]
    );
    const profile = (rows as any[])[0];
    if (!profile) return null;
    return this.processDatabaseProfile(profile);
  }

  static async update(userId: number, updates: Partial<Profile>): Promise<void> {
    const processedUpdates = this.processProfileData(updates);
    const fields = Object.keys(processedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(processedUpdates);
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

  private static processProfileData(data: Partial<Profile>): Record<string, any> {
    const processed: Record<string, any> = { ...data };
    if ('skills' in processed && processed.skills) {
      processed.skills = JSON.stringify(processed.skills);
    }
    return processed;
  }

  private static processDatabaseProfile(data: Record<string, any>): Profile {
    const processed: Record<string, any> = { ...data };
    if ('skills' in processed && processed.skills) {
      processed.skills = JSON.parse(processed.skills) as string[];
    }
    return processed as Profile;
  }
} 