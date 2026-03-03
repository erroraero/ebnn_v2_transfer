-- Add guestbook_enabled to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS guestbook_enabled boolean DEFAULT true;
