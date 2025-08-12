/*
  # Create users table for authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, unique, required)
      - `password_hash` (text, required for email/password auth)
      - `provider` (text, auth provider - 'email', 'google', 'apple')
      - `provider_id` (text, external provider ID)
      - `picture` (text, profile picture URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text,
  provider text NOT NULL DEFAULT 'email',
  provider_id text,
  picture text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();