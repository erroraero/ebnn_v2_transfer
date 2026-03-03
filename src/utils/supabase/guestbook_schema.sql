-- Guestbook Table
CREATE TABLE IF NOT EXISTS guestbook (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    note text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Public can Read
CREATE POLICY "Public can read guestbook" ON guestbook
    FOR SELECT USING (true);

-- Public can Insert (No Auth Required)
CREATE POLICY "Public can post to guestbook" ON guestbook
    FOR INSERT WITH CHECK (true);
