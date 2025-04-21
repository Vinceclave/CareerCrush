import pool from '../config/database';

export interface User {
  id?: number;
  email: string;
  password_hash: string;
  role: 'employee' | 'employer';
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  static async create(user: User): Promise<number> {
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [user.email, user.password_hash, user.role]
    );
    return (result as any).insertId;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return (rows as User[])[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return (rows as User[])[0] || null;
  }

  static async update(id: number, user: Partial<User>): Promise<void> {
    const fields = Object.keys(user).map(key => `${key} = ?`).join(', ');
    const values = Object.values(user);
    values.push(id);

    await pool.execute(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );
  }

  static async delete(id: number): Promise<void> {
    await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
  }
} 