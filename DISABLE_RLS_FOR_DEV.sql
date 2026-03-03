-- TEMPORARY: Disable RLS for development to allow updates without a real session
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;

-- Allow everything on the storage (be CAREFUL, only for local dev)
-- Run this if you have problems with uploads:
-- create policy "Dev Allow All" on storage.objects for all using (true) with check (true);
