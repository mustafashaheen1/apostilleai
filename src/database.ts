export class DatabaseService {
  constructor() {
    console.log('Database service disabled');
  }

  async initializeDatabase(): Promise<boolean> {
    console.log('Database initialization skipped');
    return true;
  }

  async createUser(userData: any): Promise<any> {
    console.log('User creation skipped - no database configured');
    return null;
  }

  async getUserByEmail(email: string): Promise<any> {
    console.log('User lookup skipped - no database configured');
    return null;
  }

  async getUserById(id: number): Promise<any> {
    console.log('User lookup skipped - no database configured');
    return null;
  }

  async updateUser(id: number, updates: any): Promise<any> {
    console.log('User update skipped - no database configured');
    return null;
  }

  async close() {
    // No connection to close
  }
}

export const databaseService = new DatabaseService();