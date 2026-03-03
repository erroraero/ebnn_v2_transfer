-- Add Music Fields to Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS music_title text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS music_artist text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS music_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS music_cover_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS music_enabled boolean DEFAULT false;

-- Add Custom Icon to Links
ALTER TABLE links ADD COLUMN IF NOT EXISTS custom_icon_url text;
