/*
  # Create order_drafts table for saving draft orders

  1. New Tables
    - `order_drafts`
      - `id` (uuid, primary key) - Unique identifier for the draft
      - `user_id` (uuid, foreign key) - References auth.users, identifies the owner
      - `form_data` (jsonb) - Stores all form data as JSON
      - `created_at` (timestamptz) - When the draft was first created
      - `updated_at` (timestamptz) - When the draft was last updated
      - Unique constraint on `user_id` to ensure one draft per user
  
  2. Security
    - Enable RLS on `order_drafts` table
    - Add policy for users to view their own drafts
    - Add policy for users to insert their own drafts
    - Add policy for users to update their own drafts
    - Add policy for users to delete their own drafts
  
  3. Performance
    - Create index on `user_id` for faster queries
  
  ## Important Notes
  - Each user can only have one draft at a time (enforced by UNIQUE constraint)
  - Drafts are automatically deleted when the user is deleted (CASCADE)
  - All draft operations are restricted to the authenticated user only
*/

CREATE TABLE IF NOT EXISTS order_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE order_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own drafts"
  ON order_drafts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts"
  ON order_drafts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON order_drafts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON order_drafts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_order_drafts_user_id ON order_drafts(user_id);