import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role: 'employee' | 'employer';
}

export interface User {
  id: string;
  email: string;
  role: 'employee' | 'employer';
}

class AuthService {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async register(credentials: RegisterCredentials) {
    const response = await axios.post(`${API_URL}/auth/register`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        id: user.id,
        email: user.email,
        role: user.role
      };
    }
    return null;
  }

  getToken(): string | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  getRole(): 'employee' | 'employer' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  getDashboardPath(): string {
    const role = this.getRole();
    return role === 'employee' ? '/employee-dashboard' : '/employer-dashboard';
  }
}

export const authService = new AuthService(); 