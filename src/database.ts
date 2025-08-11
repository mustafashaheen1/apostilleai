
import { Client, Pool } from 'pg';

export interface User {
  id: number;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple' | 'email';
  provider_id?: string;
  created_at: Date;
  updated_at: Date;
}

class DatabaseService {
  private pool: Pool;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Use connection pooling for better performance
    const poolUrl = databaseUrl.replace('.us-east-2', '-pooler.us-east-2');
    this.pool = new Pool({
      connectionString: poolUrl,
      max: 10
    });
  }

  async initializeDatabase() {
    const client = await this.pool.connect();
    try {
      // Create users table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          picture TEXT,
          provider VARCHAR(50) NOT NULL DEFAULT 'email',
          provider_id VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create index on email for faster lookups
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
      `);

      console.log('Database initialized successfully');
    } finally {
      client.release();
    }
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (email, name, picture, provider, provider_id) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (email) 
         DO UPDATE SET 
           name = EXCLUDED.name,
           picture = EXCLUDED.picture,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [userData.email, userData.name, userData.picture, userData.provider, userData.provider_id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async getUserById(id: number): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User | null> {
    const client = await this.pool.connect();
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = [id, ...Object.values(updates)];
      
      const result = await client.query(
        `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.pool.end();
  }
}

export const databaseService = new DatabaseService();
