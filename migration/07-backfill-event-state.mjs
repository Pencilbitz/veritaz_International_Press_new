// One-time backfill: derives veritaz_events.state from the existing free-text
// `location` field (e.g. "Coimbatore, Tamil Nadu" -> "Tamil Nadu"), since all
// 40 events already have the state embedded in location but the new `state`
// column was empty. Only touches rows where state is currently null.
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

// Known state names (any casing/spacing variant seen in the data) plus a
// couple of well-known state-capital cities that appear standalone.
const STATE_MAP = {
  "tamilnadu": "Tamil Nadu",
  "tamil nadu": "Tamil Nadu",
  "maharashtra": "Maharashtra",
  "rajasthan": "Rajasthan",
  "karnataka": "Karnataka",
  "uttar pradesh": "Uttar Pradesh",
  "andhra pradesh": "Andhra Pradesh",
  "west bengal": "West Bengal",
  "chennai": "Tamil Nadu",
  "raipur": "Chhattisgarh",
};

function deriveState(location) {
  if (!location) return null;
  const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1];
  if (!last) return null;
  return STATE_MAP[last.toLowerCase()] || null;
}

const { data: events, error } = await supabase
  .from("veritaz_events")
  .select("id, location, state");
if (error) throw error;

let updated = 0;
let unresolved = [];

for (const e of events) {
  if (e.state) continue; // don't touch rows already set
  const state = deriveState(e.location);
  if (!state) { unresolved.push(`${e.id}: "${e.location}"`); continue; }
  const { error: upErr } = await supabase.from("veritaz_events").update({ state }).eq("id", e.id);
  if (upErr) { console.warn(`  update failed ${e.id}: ${upErr.message}`); continue; }
  console.log(`  ${e.id}: "${e.location}" -> ${state}`);
  updated++;
}

console.log(`\nUpdated ${updated} of ${events.length} events.`);
if (unresolved.length) {
  console.log("Unresolved (leave state blank, fill in manually via admin):");
  unresolved.forEach((u) => console.log("  - " + u));
}
process.exit(0);
