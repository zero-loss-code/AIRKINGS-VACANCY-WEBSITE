/*
  # Create AirKings Job Postings System

  1. New Tables
    - `job_postings`
      - `id` (uuid, primary key)
      - `title` (text, job title)
      - `company` (text, company name)
      - `location` (text, job location)
      - `salary` (text, salary range in SAR)
      - `type` (text, job type - Full-time, Part-time, etc.)
      - `description` (text, job description)
      - `requirements` (text[], array of requirements)
      - `benefits` (text[], array of benefits)
      - `media` (jsonb, array of media objects with type and url)
      - `whatsapp_number` (text, WhatsApp contact number)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create storage bucket for job media files
    - Set up public access for media files

  3. Security
    - Enable RLS on `job_postings` table
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Create job_postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  salary text NOT NULL,
  type text NOT NULL DEFAULT 'Full-time',
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  media jsonb DEFAULT '[]',
  whatsapp_number text NOT NULL DEFAULT '971501234567',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read job postings"
  ON job_postings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert job postings"
  ON job_postings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update job postings"
  ON job_postings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job postings"
  ON job_postings
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for job media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('airkings-media', 'airkings-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view job media"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'airkings-media');

CREATE POLICY "Authenticated users can upload job media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'airkings-media');

CREATE POLICY "Authenticated users can update job media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'airkings-media');

CREATE POLICY "Authenticated users can delete job media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'airkings-media');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO job_postings (title, company, location, salary, type, description, requirements, benefits, media, whatsapp_number) VALUES
(
  'Commercial Pilot',
  'SkyLine Airways',
  'Dubai, UAE',
  '80,000 - 120,000 SAR',
  'Full-time',
  'Experienced commercial pilot needed for international flights. Must have ATPL license and minimum 3000 flight hours. Join our dynamic team and fly state-of-the-art aircraft across global destinations.',
  ARRAY[
    'Valid ATPL (Airline Transport Pilot License)',
    'Minimum 3000 flight hours',
    'Type rating on Boeing 737/Airbus A320',
    'Clean flying record',
    'English proficiency level 4 or higher',
    'Valid passport and ability to work internationally'
  ],
  ARRAY[
    'Competitive salary with performance bonuses',
    'Comprehensive health and dental insurance',
    'Annual leave and sick leave benefits',
    'Flight training and recurrent training provided',
    'Career progression opportunities',
    'International exposure and travel benefits'
  ],
  '[{"type": "image", "url": "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Commercial Pilot in Cockpit"}]',
  '971501234567'
),
(
  'Flight Attendant',
  'Emirates Airlines',
  'Dubai, UAE',
  '45,000 - 65,000 SAR',
  'Full-time',
  'Join our cabin crew team and provide exceptional service to passengers on international routes. We seek enthusiastic individuals with excellent communication skills and a passion for hospitality.',
  ARRAY[
    'High school diploma or equivalent',
    'Minimum height requirement: 160cm',
    'Excellent English communication skills',
    'Customer service experience preferred',
    'Ability to swim 50 meters',
    'Clean background check',
    'Flexibility to work irregular hours'
  ],
  ARRAY[
    'Attractive salary with flight allowances',
    'Free accommodation and transportation',
    'Medical insurance coverage',
    'Discounted travel benefits worldwide',
    'Comprehensive training program',
    'Multicultural work environment'
  ],
  '[{"type": "image", "url": "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Flight Attendant Service"}]',
  '971501234567'
),
(
  'Aircraft Maintenance Engineer',
  'Gulf Aviation Services',
  'Abu Dhabi, UAE',
  '55,000 - 75,000 SAR',
  'Full-time',
  'Skilled maintenance engineer required for aircraft inspection, repair, and maintenance operations. Must have relevant certifications and experience with commercial aircraft systems.',
  ARRAY[
    'Aircraft Maintenance Engineering degree',
    'EASA Part-66 License Category B1 or B2',
    'Minimum 3 years experience on commercial aircraft',
    'Knowledge of Boeing/Airbus systems',
    'Strong troubleshooting skills',
    'Ability to work in shifts'
  ],
  ARRAY[
    'Competitive salary with overtime pay',
    'Technical training and certifications',
    'Health insurance and life insurance',
    'Annual performance bonuses',
    'Career development programs',
    'Modern working facilities'
  ],
  '[{"type": "image", "url": "https://images.pexels.com/photos/2026327/pexels-photo-2026327.jpeg?auto=compress&cs=tinysrgb&w=800", "alt": "Aircraft Maintenance"}]',
  '971501234567'
);