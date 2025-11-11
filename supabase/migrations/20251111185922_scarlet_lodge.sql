/*
  # Add account_type field to users table

  1. Changes
    - Add `account_type` column to users table
    - Set default value to 'individual' for existing users
    - Add constraint to ensure only valid values ('individual' or 'company')

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'account_type'
  ) THEN
    ALTER TABLE users ADD COLUMN account_type text DEFAULT 'individual';
    
    -- Add constraint to ensure only valid account types
    ALTER TABLE users ADD CONSTRAINT users_account_type_check 
    CHECK (account_type IN ('individual', 'company'));
  END IF;
END $$;