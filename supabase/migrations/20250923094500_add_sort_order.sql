/*
  # Add persistent ordering for job cards

  1. Changes
    - Add integer column `sort_order` to `job_postings`
    - Initialize it for existing rows based on created_at DESC (most recent first)
    - Add index for faster sorting

  2. Notes
    - We keep it nullable to avoid hard failures; app always writes it
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_postings' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE job_postings ADD COLUMN sort_order integer;

    -- Initialize sequential order based on recency (0 = first/top)
    WITH ordered AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC, id) - 1 AS rn
      FROM job_postings
    )
    UPDATE job_postings j
    SET sort_order = o.rn
    FROM ordered o
    WHERE j.id = o.id;

    -- Optional default; app will set explicit values on insert
    ALTER TABLE job_postings ALTER COLUMN sort_order SET DEFAULT 0;
  END IF;
END $$;

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_job_postings_sort_order ON job_postings(sort_order);
