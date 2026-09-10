// Uploads a file to Supabase Storage (bucket: veritaz_media) and returns its
// public URL. Requires an authenticated admin session (RLS: only `authenticated` may insert).
import { supabase } from "./supabase";

const BUCKET = "veritaz_media";

const EXT_BY_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export const uploadImage = async (file) => {
  if (!file) return "";

  const fromName = file.name && file.name.includes(".")
    ? file.name.split(".").pop().toLowerCase()
    : null;
  const ext = fromName || EXT_BY_TYPE[file.type] || "bin";

  const rand = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const objectPath = `uploads/${rand}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || "Upload failed");
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
};

export default uploadImage;
