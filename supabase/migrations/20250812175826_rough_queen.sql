/*
  # Add company field to users table

  1. Changes
    - Add `company` column to users table to store user's company name
    - Set default value to empty string for existing users
    - Update trigger to handle the new column

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company'
  ) THEN
    ALTER TABLE users ADD COLUMN company text DEFAULT '';
  END IF;
END $$;