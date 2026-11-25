import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Checks whether a string is a valid HTTP or HTTPS URL before passing it to Supabase.
 */
function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const supabase =
  isValidHttpUrl(supabaseUrl) &&
  supabaseKey &&
  !supabaseKey.startsWith('YOUR_')
    ? createClient(supabaseUrl, supabaseKey)
    : null;
