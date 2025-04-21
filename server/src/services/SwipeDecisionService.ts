import { SwipeDecision, SwipeDecisionModel } from '../models/SwipeDecision';
import { UserService } from './UserService';

export class SwipeDecisionService {
  static async createDecision(employerId: number, employeeId: number, decision: 'accept' | 'decline'): Promise<void> {
    const employer = await UserService.getUserById(employerId);
    const employee = await UserService.getUserById(employeeId);

    if (!employer || !employee) {
      throw new Error('User not found');
    }

    if (employer.role !== 'employer' || employee.role !== 'employee') {
      throw new Error('Invalid user roles for swipe decision');
    }

    const swipeDecision: SwipeDecision = {
      employer_id: employerId,
      employee_id: employeeId,
      decision
    };

    await SwipeDecisionModel.create(swipeDecision);
  }

  static async getDecision(employerId: number, employeeId: number): Promise<SwipeDecision | null> {
    return SwipeDecisionModel.findByEmployerAndEmployee(employerId, employeeId);
  }

  static async updateDecision(employerId: number, employeeId: number, decision: 'accept' | 'decline'): Promise<void> {
    const existingDecision = await this.getDecision(employerId, employeeId);
    if (!existingDecision) {
      throw new Error('Swipe decision not found');
    }

    await SwipeDecisionModel.update(employerId, employeeId, decision);
  }

  static async deleteDecision(employerId: number, employeeId: number): Promise<void> {
    await SwipeDecisionModel.delete(employerId, employeeId);
  }
} 