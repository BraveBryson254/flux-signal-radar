import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Check .env.local."
  );
}

/**
 * Browser client — safe to use in client components. Uses the
 * publishable key only (never the secret key), and Row Level Security
 * policies on every table restrict access to each user's own data.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
