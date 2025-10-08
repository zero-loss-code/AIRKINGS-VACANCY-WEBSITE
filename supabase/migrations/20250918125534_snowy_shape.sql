/*
  # Add job status field to job_postings table

  1. Changes
    - Add `status` column to `job_postings` table with default value 'now_recruiting'
    - Add check constraint to ensure valid status values
    - Update existing records to have default status

  2. Status Options
    - 'urgent' - Red banner for urgent positions
    - 'now_recruiting' - Green banner for active recruitment
    - 'closing_soon' - Orange banner for positions closing soon
    - 'expired' - Gray banner for expired positions
*/

-- Add status column to job_postings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_postings' AND column_name = 'status'
  ) THEN
    ALTER TABLE job_postings ADD COLUMN status text DEFAULT 'now_recruiting';
  END IF;
END $$;

-- Add check constraint for valid status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'job_postings_status_check'
  ) THEN
    ALTER TABLE job_postings ADD CONSTRAINT job_postings_status_check 
    CHECK (status IN ('urgent', 'now_recruiting', 'closing_soon', 'expired'));
  END IF;
END $$;