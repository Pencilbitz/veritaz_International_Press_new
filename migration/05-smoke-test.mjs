// Exercises every query the migrated React code now runs, with the same keys
// (anon for the public site, an authenticated session for admin writes).
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const ANON = "sb_publishable_cJSlw4Gxp7laN_9igtkcew_rzelwql7";
const anon = createClient(URL, ANON, { auth: { persistSession: false } });
const admin = createClient(URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

const EVENT_SELECT =
  "id, collegeName:college_name, topic, eventTitle:topic, date:date_text, time:time_text, status, location, contact1, contact2, registrationLink:registration_link, registerButtonText:register_button_text, poster, certificate, speakerContact:speaker_contact, created_at";
const INQUIRY_SELECT =
  "id, name, email, phone, message, formType:form_type, status, date:created_at, created_at";

let fails = 0;
const ok = (label, cond, extra = "") =>
  console.log(`${cond ? "✓" : "✗ FAIL"}  ${label}${extra ? "  — " + extra : ""}`) || (cond ? 0 : fails++);

console.log("── CLIENT (anon) ──");
{
  const { data, error } = await anon.from("veritaz_books").select("*").eq("status", "In Stock");
  ok("BookStore: in-stock books", !error && data.length > 0, error?.message || `${data?.length} rows`);
}
{
  const { data, error } = await anon.from("veritaz_books").select("*");
  ok("BookDetails: all books", !error && data.length >= 119, error?.message || `${data?.length}`);
}
{
  const { data, error } = await anon.from("veritaz_conferences").select("*");
  const c = data?.[0];
  ok("Conference: list + jsonb", !error && data.length === 4 && Array.isArray(c.topics) && typeof c.dates === "object",
     error?.message);
}
{
  const { data, error } = await anon.from("veritaz_events").select(EVENT_SELECT);
  const e = data?.find((x) => x.collegeName);
  ok("Events: aliased columns", !error && data.length === 40 && !!e.collegeName && "date" in e && "registrationLink" in e,
     error?.message);
}
{
  const { data, error } = await anon.from("veritaz_testimonials").select("*").order("id", { ascending: true });
  ok("Home: testimonials", !error && data.length === 5 && typeof data[0].is_video_testimonial === "boolean",
     error?.message);
}
{
  const { data, error } = await anon.from("veritaz_team_contacts").select("*").order("id", { ascending: true });
  ok("Contacts: team", !error && data.length === 5, error?.message);
}
{
  const { error } = await anon.from("veritaz_inquiries").insert({
    name: "Smoke Test", email: "smoke@test.com", phone: "0", message: "smoke", form_type: "Contact Us",
  });
  ok("Contacts: submit inquiry (anon insert)", !error, error?.message);
}
{
  const { data } = await anon.from("veritaz_inquiries").select("*");
  ok("Contacts: anon cannot read inquiries back", data.length === 0, `saw ${data.length} rows`);
}

console.log("\n── ADMIN (authenticated) ──");
const adminAuthed = createClient(URL, ANON, { auth: { persistSession: false } });
{
  const { error } = await adminAuthed.auth.signInWithPassword({ email: "admin@veritaz.com", password: "veritaz@123" });
  ok("Login: admin@veritaz.com", !error, error?.message);
}
{
  const { data, error } = await adminAuthed.from("veritaz_inquiries").select(INQUIRY_SELECT).order("created_at", { ascending: false });
  ok("MeetOurTeam: admin reads inquiries", !error && data.length >= 1 && "formType" in data[0] && "date" in data[0], error?.message);
}
{
  // full book create/update/delete round-trip
  const id = "smoke-" + Date.now();
  let r = await adminAuthed.from("veritaz_books").insert({ id, title: "SMOKE", status: "Draft" });
  ok("AddBook: insert", !r.error, r.error?.message);
  r = await adminAuthed.from("veritaz_books").update({ price: 9 }).eq("id", id);
  ok("BookDetails: update", !r.error, r.error?.message);
  r = await adminAuthed.from("veritaz_books").delete().eq("id", id);
  ok("BookStore: delete", !r.error, r.error?.message);
}
{
  const id = "smoke-conf-" + Date.now();
  let r = await adminAuthed.from("veritaz_conferences").insert({
    id, conferencename: "SMOKE CONF", topics: ["a", "b"], speakers: [{ name: "x", image: null }],
    dates: { conferenceDate: "2026-01-01" },
  });
  ok("AddConference: insert w/ jsonb", !r.error, r.error?.message);
  const { data } = await adminAuthed.from("veritaz_conferences").select("*").eq("id", id).maybeSingle();
  ok("AddConference: jsonb round-trips", Array.isArray(data?.topics) && data?.dates?.conferenceDate === "2026-01-01");
  r = await adminAuthed.from("veritaz_conferences").delete().eq("id", id);
  ok("Conferences: delete", !r.error, r.error?.message);
}
{
  const id = "smoke-evt-" + Date.now();
  let r = await adminAuthed.from("veritaz_events").insert({ id, college_name: "SMOKE COLLEGE", status: "Upcoming" });
  ok("EventDetails: insert", !r.error, r.error?.message);
  r = await adminAuthed.from("veritaz_events").delete().eq("id", id);
  ok("Events: delete", !r.error, r.error?.message);
}

// cleanup smoke inquiries
await admin.from("veritaz_inquiries").delete().like("name", "Smoke Test");

console.log(`\n${fails === 0 ? "✅ ALL SMOKE TESTS PASSED" : `❌ ${fails} failure(s)`}`);
process.exit(fails === 0 ? 0 : 1);
