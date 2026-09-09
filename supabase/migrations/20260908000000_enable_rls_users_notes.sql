-- Enables Row Level Security on public.users and public.notes.
--
-- This app has no Supabase Auth session (auth.uid() is never populated) and
-- does all its own authorization in application code. Its Supabase client
-- (lib/supabaseClient.js) already authenticates with the project's SECRET key
-- (sb_secret_..., the successor to service_role), which carries BYPASSRLS and
-- ignores RLS entirely — confirmed by checking the actual key value in .env.
-- So these tables intentionally get NO policies here: once RLS is enabled with
-- zero policies, every other role (anon/publishable, authenticated — what the
-- public REST API uses) is denied all access, while the app keeps working
-- completely unchanged.
--
-- No code or env var changes are required before running this — just apply it
-- in the Supabase SQL Editor (or via `supabase db push` if you adopt the CLI).

alter table public.users enable row level security;
alter table public.notes enable row level security;
