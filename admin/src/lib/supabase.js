// src/lib/supabase.js
// Centralized Supabase client for the admin dashboard (Firestore + Auth replacement).
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// The veritaz_events table uses snake_case columns; the admin UI reads the
// original camelCase Firestore field names, so alias them back on every select.
export const EVENT_SELECT =
  "id, collegeName:college_name, topic, eventTitle:topic, date:date_text, time:time_text, status, location, state, contact1, contact2, registrationLink:registration_link, registerButtonText:register_button_text, poster, certificate, speakerContact:speaker_contact, created_at";

// Maps a camelCase event object (as used by the admin forms) to the
// snake_case column names for insert/update into veritaz_events.
export function toEventRow(e) {
  const row = {
    college_name: e.collegeName ?? null,
    topic: e.topic ?? e.eventTitle ?? null,
    date_text: e.date ?? null,
    time_text: e.time ?? null,
    status: e.status ?? null,
    location: e.location ?? null,
    state: e.state ?? null,
    contact1: e.contact1 ?? null,
    contact2: e.contact2 ?? null,
    registration_link: e.registrationLink ?? null,
    register_button_text: e.registerButtonText ?? null,
    poster: e.poster ?? null,
    certificate: e.certificate ?? null,
    speaker_contact: e.speakerContact ?? null,
  };
  if (e.id !== undefined && e.id !== null && e.id !== "") row.id = String(e.id);
  return row;
}

export default supabase;
