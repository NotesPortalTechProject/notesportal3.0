import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
// Despite the env var name, this is Supabase's "secret" key (sb_secret_... —
// the successor to service_role): it carries BYPASSRLS and skips every RLS
// policy. That's required here since the app authorizes requests itself and
// never sends a Supabase Auth session, so RLS (enabled on users/notes with no
// policies) would otherwise block every query. Never expose this key to
// client-side code.
const supabaseSecretKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseSecretKey);