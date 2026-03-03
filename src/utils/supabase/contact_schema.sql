-- Contact Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    attachment_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public can Insert (No Auth Required)
CREATE POLICY "Public can submit contact form" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Allow Service Role to manage all
CREATE POLICY "Service role can manage all contacts" ON contact_submissions
    FOR ALL USING (true) WITH CHECK (true);

-- Add contact_enabled to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_enabled boolean DEFAULT true;
