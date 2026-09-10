// Migrates existing image assets into Supabase Storage (bucket: veritaz_media)
// and repoints the URL columns/JSON fields in the veritaz_* tables.
//
// Sources handled:
//   - Cloudinary / image2url.com / *.r2.dev / other absolute http(s) image URLs -> downloaded
//   - relative "/assets/..." paths -> read from client/public or admin/public on disk
// Left untouched (not images): Google Drive doc links, mailto:, blank, and anything
//   already pointing at veritaz_media.
//
// Idempotent: re-running skips fields already on veritaz_media and reuses uploads
// recorded in migration/image-map.json.
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const PUBLIC_DIRS = [
  path.join(repoRoot, "client", "public"),
  path.join(repoRoot, "admin", "public"),
];
const BUCKET = "veritaz_media";
const mapPath = path.join(__dirname, "image-map.json");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const urlMap = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, "utf-8")) : {};
const stats = { migrated: 0, reused: 0, skipped: 0, notFound: 0, failed: 0 };

function saveMap() {
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2), "utf-8");
}

const EXT_TYPES = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
  ".avif": "image/avif", ".bmp": "image/bmp",
};

function isSupabaseUrl(u) {
  return typeof u === "string" && u.includes(`/storage/v1/object/public/${BUCKET}/`);
}
function isMigratableImage(u) {
  if (!u || typeof u !== "string") return false;
  if (isSupabaseUrl(u)) return false;
  const s = u.trim();
  if (s === "" || s === "#") return false;
  if (s.startsWith("mailto:") || s.startsWith("tel:")) return false;
  // Google Drive / Docs links are documents, not fetchable images
  if (s.includes("drive.google.com") || s.includes("docs.google.com")) return false;
  const lower = s.split("?")[0].toLowerCase();
  const looksImg = Object.keys(EXT_TYPES).some((e) => lower.endsWith(e));
  if (s.startsWith("http://") || s.startsWith("https://")) {
    // cloudinary urls often omit extension but are images; allow known image hosts
    return looksImg || s.includes("res.cloudinary.com") || s.includes("image2url.com") || s.includes("r2.dev");
  }
  // relative path
  return looksImg || s.startsWith("/assets") || s.startsWith("assets");
}

function extFor(u, contentType) {
  const clean = u.split("?")[0];
  const e = path.extname(clean).toLowerCase();
  if (EXT_TYPES[e]) return e;
  if (contentType && contentType.includes("png")) return ".png";
  if (contentType && contentType.includes("webp")) return ".webp";
  if (contentType && contentType.includes("jpeg")) return ".jpg";
  return ".jpg";
}

function resolveLocal(u) {
  const rel = u.replace(/^\//, "");
  for (const base of PUBLIC_DIRS) {
    const p = path.join(base, rel);
    if (fs.existsSync(p)) return p;
    // try URL-decoded (spaces etc.)
    try {
      const dp = path.join(base, decodeURIComponent(rel));
      if (fs.existsSync(dp)) return dp;
    } catch {}
  }
  return null;
}

async function getBytes(u) {
  if (u.startsWith("http://") || u.startsWith("https://")) {
    const res = await fetch(u, { signal: AbortSignal.timeout(45000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    return { buf, contentType: res.headers.get("content-type") || "" };
  }
  const local = resolveLocal(u);
  if (!local) return { notFound: true };
  return { buf: fs.readFileSync(local), contentType: "" };
}

// Migrate one URL value. Returns the new URL, or the original if unchanged.
async function migrateUrl(u, keyHint) {
  if (!isMigratableImage(u)) {
    if (isSupabaseUrl(u)) stats.skipped++;
    else stats.skipped++;
    return u;
  }
  if (urlMap[u]) {
    stats.reused++;
    return urlMap[u];
  }
  try {
    const { buf, contentType, notFound } = await getBytes(u);
    if (notFound) {
      console.warn(`  not found on disk: ${u}`);
      stats.notFound++;
      return u;
    }
    const ext = extFor(u, contentType);
    const hash = crypto.createHash("sha1").update(u).digest("hex").slice(0, 12);
    const objectPath = `${keyHint}/${hash}${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, buf, {
        contentType: EXT_TYPES[ext] || contentType || "application/octet-stream",
        upsert: true,
      });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
    urlMap[u] = pub.publicUrl;
    saveMap();
    stats.migrated++;
    console.log(`  ✓ ${u}  ->  ${objectPath}`);
    return pub.publicUrl;
  } catch (e) {
    console.warn(`  ✗ failed: ${u}  (${e.message})`);
    stats.failed++;
    return u;
  }
}

async function fetchAll(table, select = "*") {
  const { data, error } = await supabase.from(table).select(select);
  if (error) throw new Error(`${table}: ${error.message}`);
  return data || [];
}

async function run() {
  // ---- books: cover1, cover2 ----
  console.log("\n# veritaz_books");
  for (const b of await fetchAll("veritaz_books", "id, cover1, cover2")) {
    const patch = {};
    const c1 = await migrateUrl(b.cover1, `books/${b.id}`);
    if (c1 !== b.cover1) patch.cover1 = c1;
    const c2 = await migrateUrl(b.cover2, `books/${b.id}`);
    if (c2 !== b.cover2) patch.cover2 = c2;
    if (Object.keys(patch).length) {
      const { error } = await supabase.from("veritaz_books").update(patch).eq("id", b.id);
      if (error) console.warn(`  update failed book ${b.id}: ${error.message}`);
    }
  }

  // ---- events: poster ----
  console.log("\n# veritaz_events");
  for (const e of await fetchAll("veritaz_events", "id, poster")) {
    const p = await migrateUrl(e.poster, `events/${e.id}`);
    if (p !== e.poster) {
      const { error } = await supabase.from("veritaz_events").update({ poster: p }).eq("id", e.id);
      if (error) console.warn(`  update failed event ${e.id}: ${error.message}`);
    }
  }

  // ---- testimonials: avatar_url ----
  console.log("\n# veritaz_testimonials");
  for (const t of await fetchAll("veritaz_testimonials", "id, avatar_url")) {
    const a = await migrateUrl(t.avatar_url, `testimonials/${t.id}`);
    if (a !== t.avatar_url) {
      const { error } = await supabase.from("veritaz_testimonials").update({ avatar_url: a }).eq("id", t.id);
      if (error) console.warn(`  update failed testimonial ${t.id}: ${error.message}`);
    }
  }

  // ---- team_contacts: photo ----
  console.log("\n# veritaz_team_contacts");
  for (const m of await fetchAll("veritaz_team_contacts", "id, photo")) {
    const ph = await migrateUrl(m.photo, `team/${m.id}`);
    if (ph !== m.photo) {
      const { error } = await supabase.from("veritaz_team_contacts").update({ photo: ph }).eq("id", m.id);
      if (error) console.warn(`  update failed team ${m.id}: ${error.message}`);
    }
  }

  // ---- conferences: poster, brochuredownload, + speaker/committee images in jsonb ----
  console.log("\n# veritaz_conferences");
  for (const c of await fetchAll("veritaz_conferences")) {
    const patch = {};
    const poster = await migrateUrl(c.poster, `conferences/${c.id}`);
    if (poster !== c.poster) patch.poster = poster;
    const bro = await migrateUrl(c.brochuredownload, `conferences/${c.id}`);
    if (bro !== c.brochuredownload) patch.brochuredownload = bro;

    for (const field of ["speakers", "advisorycommittee", "globalexperts"]) {
      const arr = Array.isArray(c[field]) ? c[field] : [];
      let changed = false;
      const next = [];
      for (const item of arr) {
        if (item && typeof item === "object" && item.image) {
          const nu = await migrateUrl(item.image, `conferences/${c.id}/${field}`);
          if (nu !== item.image) { changed = true; next.push({ ...item, image: nu }); continue; }
        }
        next.push(item);
      }
      if (changed) patch[field] = next;
    }

    if (Object.keys(patch).length) {
      const { error } = await supabase.from("veritaz_conferences").update(patch).eq("id", c.id);
      if (error) console.warn(`  update failed conference ${c.id}: ${error.message}`);
    }
  }

  console.log("\n=== image migration summary ===");
  console.table(stats);
  console.log(`URL map: ${Object.keys(urlMap).length} entries in migration/image-map.json`);
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
