// Loads the verified Firestore backup (migration/firebase-backup/*.json) into Supabase.
// Uses the service/secret key so RLS doesn't block the migration write.
// Safe to re-run: every table load is an upsert on primary key.
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

// Find the one doc in a "single doc holds a data[] array" collection that is the
// real table (has an array `data` field), ignoring PHPMyAdmin export-artifact docs
// and stray test/junk docs that the live app never reads.
function extractRows(docs) {
  const tableDoc = docs.find((d) => Array.isArray(d.data));
  return tableDoc ? tableDoc.data : [];
}

function toNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function toInt(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

// Some conference sub-fields were written as JSON-encoded strings in older records
// (legacy MySQL->Firestore import) and as native objects/arrays in newer ones.
function toJson(v, fallback) {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "object") return v;
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      return parsed;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

// Migration run timestamp — used for records that never had a created_at in the source.
const MIGRATION_TS = new Date().toISOString();

function toTimestamp(v) {
  // Always return a concrete value: PostgREST bulk-insert fills missing keys with
  // NULL (not the column default), so every row must carry created_at explicitly.
  return v || MIGRATION_TS;
}

function toBool(v) {
  return v === true || v === "1" || v === 1 || v === "true";
}

async function upsert(table, rows, onConflict = "id") {
  if (rows.length === 0) {
    console.log(`SKIP ${table}: 0 rows to load`);
    return { count: 0, error: null };
  }
  const { error, count } = await supabase
    .from(table)
    .upsert(rows, { onConflict, count: "exact" });
  if (error) {
    console.error(`FAIL ${table}:`, error.message);
    return { count: 0, error };
  }
  console.log(`OK   ${table}: upserted ${rows.length} row(s)`);
  return { count: rows.length, error: null };
}

async function main() {
  const results = {};

  // ---- books ----
  {
    const docs = readBackup("books_5_.json");
    const rawRows = extractRows(docs);
    const rows = rawRows.map((r) => ({
      id: String(r.id),
      title: r.title ?? null,
      authors: r.authors ?? r.author ?? null,
      isbn: r.isbn ?? null,
      edition: r.edition ?? null,
      ratings: toNumber(r.ratings),
      about: r.about ?? null,
      price: toNumber(r.price),
      status: r.status ?? null,
      weight: r.weight ?? null,
      binding: r.binding ?? null,
      dimensions: r.dimensions ?? null,
      language: r.language ?? null,
      format: r.format ?? null,
      pages: toInt(r.pages),
      copyright: r.copyright != null ? String(r.copyright) : null,
      cover1: r.cover1 ?? null,
      cover2: r.cover2 ?? null,
      flipkart: r.flipkart ?? null,
      amazon: r.amazon ?? null,
      created_at: toTimestamp(r.created_at),
    }));
    results.books = { firebaseRows: rawRows.length, ...(await upsert("veritaz_books", rows)) };
  }

  // ---- conferences ----
  {
    const docs = readBackup("conferences_2_.json");
    const rawRows = extractRows(docs);
    const rows = rawRows.map((r) => {
      const bank = toJson(r.bankdetails, null);
      if (bank && !bank.accountNumber && bank.accountNo) {
        bank.accountNumber = bank.accountNo;
      }
      return {
        id: String(r.id),
        conferencename: r.conferencename ?? r.conferenceName ?? null,
        conferencetitle: r.conferencetitle ?? null,
        isbn: r.isbn ?? null,
        type: r.type ?? null,
        about: r.about ?? null,
        conferencestatus: r.conferencestatus ?? null,
        conferencesecurity: r.conferencesecurity ?? null,
        conferencevalidity: r.conferencevalidity ?? null,
        registerlink: r.registerlink ?? null,
        listenerparticipation: r.listenerparticipation ?? null,
        proceedingsdownload: r.proceedingsdownload ?? null,
        poster: r.poster ?? null,
        brochuredownload: r.brochuredownload ?? null,
        dates: toJson(r.dates, null),
        fees: toJson(r.fees, null),
        bankdetails: bank,
        topics: toJson(r.topics, []),
        speakers: toJson(r.speakers, []),
        organizingcommittee: toJson(r.organizingcommittee, []),
        advisorycommittee: toJson(r.advisorycommittee, []),
        globalexperts: toJson(r.globalexperts, []),
        certificatesdownload: toJson(r.certificatesdownload, []),
        created_at: toTimestamp(r.created_at),
      };
    });
    results.conferences = { firebaseRows: rawRows.length, ...(await upsert("veritaz_conferences", rows)) };
  }

  // ---- events ----
  {
    const docs = readBackup("events_2_.json");
    const rawRows = extractRows(docs);
    const rows = rawRows.map((r) => ({
      id: String(r.id),
      college_name: r.collegeName ?? null,
      topic: r.topic ?? r.eventTitle ?? r.title ?? null,
      date_text: r.date ?? null,
      time_text: r.time ?? null,
      status: r.status ?? null,
      location: r.location ?? null,
      contact1: r.contact1 ?? null,
      contact2: r.contact2 ?? null,
      registration_link: r.registrationLink ?? null,
      register_button_text: r.registerButtonText ?? null,
      poster: r.poster ?? r.image ?? null,
      certificate: r.certificate || null,
      speaker_contact: toJson(r.speakerContact, r.speakerContact ?? null),
      created_at: toTimestamp(r.created_at),
    }));
    results.events = { firebaseRows: rawRows.length, ...(await upsert("veritaz_events", rows)) };
  }

  // ---- testimonials ----
  {
    const docs = readBackup("testimonials.json");
    const rawRows = extractRows(docs);
    const rows = rawRows.map((r) => ({
      id: String(r.id),
      name: r.name ?? null,
      designation: r.designation ?? null,
      rating: toNumber(r.rating),
      content: r.content ?? null,
      avatar_url: r.avatar_url ?? null,
      is_video_testimonial: toBool(r.is_video_testimonial),
      video_url: r.video_url || null,
      created_at: toTimestamp(r.created_at),
    }));
    results.testimonials = { firebaseRows: rawRows.length, ...(await upsert("veritaz_testimonials", rows)) };
  }

  // ---- team_contacts ----
  {
    const docs = readBackup("team_contacts.json");
    const rawRows = extractRows(docs);
    const rows = rawRows.map((r) => ({
      id: String(r.id),
      name: r.name ?? null,
      designation: r.designation ?? null,
      phone: r.phone ?? null,
      email: r.email ?? null,
      photo: r.photo ?? null,
      created_at: toTimestamp(r.created_at),
    }));
    results.team_contacts = { firebaseRows: rawRows.length, ...(await upsert("veritaz_team_contacts", rows)) };
  }

  // ---- inquiries ---- (0 live records at backup time; nothing to load)
  results.inquiries = { firebaseRows: 0, count: 0, error: null };

  console.log("\n=== Load summary ===");
  console.table(
    Object.fromEntries(
      Object.entries(results).map(([k, v]) => [
        k,
        { firebaseRows: v.firebaseRows, loadedToSupabase: v.count, error: v.error ? v.error.message : "" },
      ])
    )
  );

  fs.writeFileSync(path.join(__dirname, "load-summary.json"), JSON.stringify(results, null, 2), "utf-8");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
