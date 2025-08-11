
import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10
});

// Initialize database
app.post('/api/init-db', async (req, res) => {
  const client = await pool.connect();
  try {
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
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    
    res.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Create user
app.post('/api/users', async (req, res) => {
  const { email, name, picture, provider, provider_id } = req.body;
  const client = await pool.connect();
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
      [email, name, picture, provider, provider_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get user by email
app.get('/api/users/:email', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [req.params.email]);
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
