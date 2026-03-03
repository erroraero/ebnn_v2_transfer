-- Subscribers Table for Newsletter Tracking
CREATE TABLE IF NOT EXISTS subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow Service Role to manage all
CREATE POLICY "Service role can manage all subscribers" ON subscribers
    FOR ALL USING (true) WITH CHECK (true);
