import pool from '../config/database';

export interface SwipeDecision {
  employer_id: number;
  employee_id: number;
  decision: 'accept' | 'decline';
  decision_timestamp?: Date;
}

export class SwipeDecisionModel {
  static async create(decision: SwipeDecision): Promise<void> {
    await pool.execute(
      'INSERT INTO swipe_decisions (employer_id, employee_id, decision) VALUES (?, ?, ?)',
      [decision.employer_id, decision.employee_id, decision.decision]
    );
  }

  static async findByEmployerAndEmployee(employerId: number, employeeId: number): Promise<SwipeDecision | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM swipe_decisions WHERE employer_id = ? AND employee_id = ?',
      [employerId, employeeId]
    );
    return (rows as SwipeDecision[])[0] || null;
  }

  static async update(employerId: number, employeeId: number, decision: 'accept' | 'decline'): Promise<void> {
    await pool.execute(
      'UPDATE swipe_decisions SET decision = ? WHERE employer_id = ? AND employee_id = ?',
      [decision, employerId, employeeId]
    );
  }

  static async delete(employerId: number, employeeId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM swipe_decisions WHERE employer_id = ? AND employee_id = ?',
      [employerId, employeeId]
    );
  }
} 