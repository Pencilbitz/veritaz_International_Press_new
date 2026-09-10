// src/lib/supabase.js
// Centralized Supabase client for the public site.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// The events table uses snake_case columns; the UI components read the original
// camelCase field names, so we alias them back on every select.
export const EVENT_SELECT =
  "id, collegeName:college_name, topic, eventTitle:topic, date:date_text, time:time_text, status, location, contact1, contact2, registrationLink:registration_link, registerButtonText:register_button_text, poster, certificate, speakerContact:speaker_contact, created_at";

export default supabase;
