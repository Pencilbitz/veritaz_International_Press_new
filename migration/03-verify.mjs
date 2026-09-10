// Verifies the Supabase data against the Firebase backup: row counts, every id,
// and spot-checks of key fields / nested JSON / image URLs.
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = path.join(__dirname, "firebase-backup");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

function readBackup(file) {
  return JSON.parse(fs.readFileSync(path.join(backupDir, file), "utf-8"));
}
function extractRows(docs) {
  const tableDoc = docs.find((d) => Array.isArray(d.data));
  return tableDoc ? tableDoc.data : [];
}
async function fetchAll(table) {
  const out = [];
  let from = 0;
  const step = 1000;
  for (;;) {
    const { data, error } = await supabase.from(table).select("*").range(from, from + step - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < step) break;
    from += step;
  }
  return out;
}

let problems = 0;
function check(cond, msg) {
  if (!cond) {
    problems++;
    console.log("  ✗ " + msg);
  }
}

const plan = [
  { file: "books_5_.json", table: "veritaz_books", label: "books", name: (r) => r.title },
  { file: "conferences_2_.json", table: "veritaz_conferences", label: "conferences", name: (r) => r.conferencename ?? r.conferenceName },
  { file: "events_2_.json", table: "veritaz_events", label: "events", name: (r) => r.collegeName },
  { file: "testimonials.json", table: "veritaz_testimonials", label: "testimonials", name: (r) => r.name },
  { file: "team_contacts.json", table: "veritaz_team_contacts", label: "team_contacts", name: (r) => r.name },
];

for (const p of plan) {
  console.log(`\n=== ${p.label} ===`);
  const fbRows = extractRows(readBackup(p.file));
  const sbRows = await fetchAll(p.table);

  check(fbRows.length === sbRows.length, `row count: firebase=${fbRows.length} supabase=${sbRows.length}`);
  console.log(`  firebase=${fbRows.length}  supabase=${sbRows.length}`);

  const sbById = new Map(sbRows.map((r) => [String(r.id), r]));
  for (const fb of fbRows) {
    const id = String(fb.id);
    const sb = sbById.get(id);
    if (!sb) {
      problems++;
      console.log(`  ✗ missing id ${id} (${p.name(fb) || "?"}) in supabase`);
      continue;
    }
    // name/title text preserved exactly
    const fbName = p.name(fb);
    const sbName = sb.title ?? sb.conferencename ?? sb.college_name ?? sb.name;
    if (fbName != null) check(fbName === sbName, `id ${id}: name mismatch fb="${fbName}" sb="${sbName}"`);
  }
}

// --- conference nested JSON must be real json, not strings ---
console.log(`\n=== conferences nested JSON ===`);
const confSb = await fetchAll("veritaz_conferences");
for (const c of confSb) {
  for (const f of ["dates", "fees", "topics", "speakers", "organizingcommittee", "advisorycommittee", "globalexperts", "certificatesdownload"]) {
    check(typeof c[f] !== "string", `conf ${c.id}: field ${f} is a string, expected parsed json`);
  }
}
console.log(`  checked ${confSb.length} conferences for stringified json`);

// --- image URL fields preserved verbatim from source ---
console.log(`\n=== image URL preservation (sample) ===`);
const booksFb = extractRows(readBackup("books_5_.json"));
const booksSb = new Map((await fetchAll("veritaz_books")).map((r) => [String(r.id), r]));
let imgChecked = 0;
for (const b of booksFb) {
  const sb = booksSb.get(String(b.id));
  if (!sb) continue;
  check((b.cover1 ?? null) === (sb.cover1 ?? null), `book ${b.id}: cover1 changed`);
  check((b.cover2 ?? null) === (sb.cover2 ?? null), `book ${b.id}: cover2 changed`);
  imgChecked++;
}
console.log(`  checked ${imgChecked} books' cover URLs`);

console.log(`\n${problems === 0 ? "✅ VERIFICATION PASSED — no mismatches" : `❌ ${problems} problem(s) found`}`);
process.exit(problems === 0 ? 0 : 1);
