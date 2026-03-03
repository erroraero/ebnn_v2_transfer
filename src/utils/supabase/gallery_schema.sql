-- Create Gallery Table
CREATE TABLE gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL, -- Will use mock ID in dev
  url text NOT NULL,
  type text NOT NULL, -- 'image' or 'video'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- DISABLE RLS for Gallery in Dev
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
