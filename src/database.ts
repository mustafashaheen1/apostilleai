import { User } from './types';

class DatabaseService {
  private apiBaseUrl: string;

  constructor() {
    // In development, use the backend API
    this.apiBaseUrl = 'http://localhost:3001/api';
  }

  async initializeDatabase() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/init-db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Database initialized successfully:', result.message);
    } catch (error) {
      console.error('Error initializing database:', error);
      // For now, just log the error and continue
    }
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/users/${encodeURIComponent(email)}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    // This would need to be implemented in the backend API
    console.log('getUserById not implemented in API yet');
    return null;
  }

  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
    // This would need to be implemented in the backend API
    console.log('updateUser not implemented in API yet');
    return null;
  }

  async close() {
    // No connection to close in API-based approach
  }
}

export const databaseService = new DatabaseService();