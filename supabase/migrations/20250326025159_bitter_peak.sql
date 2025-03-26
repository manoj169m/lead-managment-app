/*
  # Create leads and comments tables

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `business_name` (text)
      - `phone` (text)
      - `status` (text)
      - `link` (text, nullable)
      - `location` (text)
      - `created_at` (timestamp)
    - `comments`
      - `id` (uuid, primary key)
      - `lead_id` (uuid, foreign key)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since we're not implementing auth yet)
*/

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL,
  link text,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (temporary until auth is implemented)
CREATE POLICY "Allow public access to leads"
  ON leads
  FOR ALL
  TO public
  USING (true);

CREATE POLICY "Allow public access to comments"
  ON comments
  FOR ALL
  TO public
  USING (true);