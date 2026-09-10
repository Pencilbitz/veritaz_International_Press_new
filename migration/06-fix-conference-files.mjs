// Uploads every conference file reference (poster, brochuredownload,
// proceedingsdownload, certificatesdownload[].file) that still points at a
// local /assets path into veritaz_media, and repoints the column/JSON.
// Handles stored filenames that don't exactly match the file on disk via
// an explicit override map.
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const CONF_DIRS = [
  path.join(repoRoot, "admin", "public", "assets", "image", "conference"),
  path.join(repoRoot, "client", "public", "assets", "image", "conference"),
];
const BUCKET = "veritaz_media";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

// stored path (as in DB)  ->  actual filename in the conference folder
const OVERRIDES = {
  "/assets/image/conferences/1783930792973-ICGMRFT-31 Mar 2026 (3).jpeg": "ICGMRFT-31 Mar 2026 (1).jpeg",
  "/assets/image/conference/ICIRMD-31-Jan-2026.jpeg": "ICIRMD-31-Jan-26.jpeg",
  "/assets/image/conference/ICMARD-29-Dec-2025.jpeg": "ICMARD-Dec-29.svg",
};

const TYPES = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".pdf": "application/pdf",
};

const stats = { uploaded: 0, skipped: 0, unresolved: [] };

function resolveFile(stored) {
  if (!stored || typeof stored !== "string") return null;
  if (stored.startsWith("http")) return { already: true };
  let name = OVERRIDES[stored] || decodeURIComponent(stored.split("/").pop());
  for (const dir of CONF_DIRS) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) return { file: p, name };
    try {
      const p2 = path.join(dir, decodeURIComponent(name));
      if (fs.existsSync(p2)) return { file: p2, name: decodeURIComponent(name) };
    } catch {}
  }
  return null;
}

async function migrate(stored, confId) {
  const r = resolveFile(stored);
  if (!r) { stats.unresolved.push(`conf ${confId}: ${stored}`); return stored; }
  if (r.already) { stats.skipped++; return stored; }
  const ext = path.extname(r.name).toLowerCase();
  const buf = fs.readFileSync(r.file);
  const hash = crypto.createHash("sha1").update(r.name).digest("hex").slice(0, 12);
  const objectPath = `conferences/${confId}/${hash}${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, buf, {
    contentType: TYPES[ext] || "application/octet-stream",
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  stats.uploaded++;
  console.log(`  conf ${confId}: ${r.name}  ->  ${objectPath}`);
  return data.publicUrl;
}

const { data: confs, error } = await supabase
  .from("veritaz_conferences")
  .select("id, poster, brochuredownload, proceedingsdownload, certificatesdownload");
if (error) throw error;

for (const c of confs) {
  const patch = {};

  const poster = await migrate(c.poster, c.id);
  if (poster !== c.poster) patch.poster = poster;

  const bro = await migrate(c.brochuredownload, c.id);
  if (bro !== c.brochuredownload) patch.brochuredownload = bro;

  const proc = await migrate(c.proceedingsdownload, c.id);
  if (proc !== c.proceedingsdownload) patch.proceedingsdownload = proc;

  if (Array.isArray(c.certificatesdownload) && c.certificatesdownload.length) {
    const next = [];
    let changed = false;
    for (const cert of c.certificatesdownload) {
      if (cert && cert.file) {
        const nu = await migrate(cert.file, c.id);
        if (nu !== cert.file) { changed = true; next.push({ ...cert, file: nu }); continue; }
      }
      next.push(cert);
    }
    if (changed) patch.certificatesdownload = next;
  }

  if (Object.keys(patch).length) {
    const { error: upErr } = await supabase.from("veritaz_conferences").update(patch).eq("id", c.id);
    if (upErr) console.warn(`  update failed conf ${c.id}: ${upErr.message}`);
  }
}

console.log("\n=== summary ===");
console.log(`uploaded: ${stats.uploaded}   skipped(already https): ${stats.skipped}`);
if (stats.unresolved.length) {
  console.log("UNRESOLVED (no matching file on disk):");
  stats.unresolved.forEach((u) => console.log("  - " + u));
}
process.exit(0);
