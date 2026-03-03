-- Add location_name to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location_name text DEFAULT 'Delhi, India';
