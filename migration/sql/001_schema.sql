-- Veritaz International Press — Firebase -> Supabase migration
-- Schema creation (run once in Supabase SQL Editor).
-- Safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE.
-- Table names are prefixed with veritaz_ to namespace them within the shared "public" schema.

create extension if not exists pgcrypto;

-- =========================================================
-- veritaz_books  (was Firestore collection "books (5)")
-- =========================================================
create table if not exists public.veritaz_books (
  id          text primary key,          -- preserves the original app-level record id
  title       text not null,
  authors     text,
  isbn        text,
  edition     text,
  ratings     numeric,
  about       text,
  price       numeric,
  status      text,                      -- "In Stock" | "Out of Stock" | "Draft"
  weight      text,
  binding     text,
  dimensions  text,
  language    text,
  format      text,
  pages       integer,
  copyright   text,
  cover1      text,                      -- image URL
  cover2      text,                      -- image URL
  flipkart    text,                      -- external URL
  amazon      text,                      -- external URL
  created_at  timestamptz not null default now()
);
create index if not exists veritaz_books_status_idx on public.veritaz_books (status);

-- =========================================================
-- veritaz_conferences  (was Firestore collection "conferences (2)")
-- Nested/embedded sub-lists kept as jsonb, mirroring the existing
-- Firestore document shape almost exactly (minimal app rewrite).
-- =========================================================
create table if not exists public.veritaz_conferences (
  id                    text primary key,
  conferencename        text,
  conferencetitle       text,
  isbn                  text,
  type                  text,            -- Virtual | In-Person | Hybrid Conference
  about                 text,
  conferencestatus      text,            -- Fully Released | Upcoming | Ongoing | Completed
  conferencesecurity    text,            -- Public | Private
  conferencevalidity    text,
  registerlink          text,
  listenerparticipation text,
  proceedingsdownload   text,
  poster                text,            -- image URL
  brochuredownload      text,            -- file URL
  dates                 jsonb,           -- { abstractSubmission, fullPaperSubmission, conferenceDate }
  fees                  jsonb,           -- { academicians, student, researchScholars, listener }
  bankdetails           jsonb,           -- { bankName, accountName, accountNumber, ifscCode, branch, upiId }
  topics                jsonb not null default '[]'::jsonb,               -- array of strings
  speakers              jsonb not null default '[]'::jsonb,               -- array of { name, designation, institution, image }
  organizingcommittee   jsonb not null default '[]'::jsonb,               -- array of { role, name, mobile, email }
  advisorycommittee     jsonb not null default '[]'::jsonb,               -- array of { name, designation, institution, location, image }
  globalexperts         jsonb not null default '[]'::jsonb,               -- array of { name, designation, institution, location, image }
  certificatesdownload  jsonb not null default '[]'::jsonb,               -- array of { name, file }
  created_at            timestamptz not null default now()
);
create index if not exists veritaz_conferences_status_idx on public.veritaz_conferences (conferencestatus);

-- =========================================================
-- veritaz_events  (was Firestore collection "events (2)")
-- =========================================================
create table if not exists public.veritaz_events (
  id                   text primary key,
  college_name         text,
  topic                text,
  date_text            text,             -- kept as free text: source data is not parseable dates
                                          -- (e.g. "15 to 19 June 2026") — see migration/firebase-backup
  time_text            text,
  status               text,             -- "Completed" | absent/other = upcoming
  location             text,
  contact1             text,
  contact2             text,
  registration_link    text,
  register_button_text text,
  poster               text,             -- image URL
  certificate          text,             -- URL, nullable
  speaker_contact      jsonb,            -- sometimes a JSON array in the source, kept flexible
  created_at           timestamptz not null default now()
);
create index if not exists veritaz_events_status_idx on public.veritaz_events (status);

-- =========================================================
-- veritaz_testimonials
-- =========================================================
create table if not exists public.veritaz_testimonials (
  id                    text primary key,
  name                  text,
  designation           text,
  rating                numeric,
  content               text,
  avatar_url            text,
  is_video_testimonial  boolean not null default false,
  video_url             text,
  created_at            timestamptz not null default now()
);

-- =========================================================
-- veritaz_team_contacts
-- =========================================================
create table if not exists public.veritaz_team_contacts (
  id          text primary key,
  name        text,
  designation text,
  phone       text,
  email       text,
  photo       text,                      -- image URL
  created_at  timestamptz not null default now()
);

-- =========================================================
-- veritaz_inquiries  (was a real multi-doc Firestore collection; currently empty)
-- New uuid primary key since there is no legacy id to preserve.
-- =========================================================
create table if not exists public.veritaz_inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text,
  phone       text,
  message     text,
  form_type   text,                      -- "Publish Your Book" | "Get In Touch" | etc.
  status      text not null default 'Pending',   -- Pending | Reviewed | In Progress | Resolved
  created_at  timestamptz not null default now()
);
create index if not exists veritaz_inquiries_created_at_idx on public.veritaz_inquiries (created_at desc);

-- =========================================================
-- Row Level Security
-- Public site (anon key) can read published content and submit inquiries.
-- Admin app writes require an authenticated (Supabase Auth) session.
-- =========================================================
alter table public.veritaz_books                enable row level security;
alter table public.veritaz_conferences          enable row level security;
alter table public.veritaz_events               enable row level security;
alter table public.veritaz_testimonials         enable row level security;
alter table public.veritaz_team_contacts        enable row level security;
alter table public.veritaz_inquiries            enable row level security;

-- Public read access
drop policy if exists "public read" on public.veritaz_books;
create policy "public read" on public.veritaz_books for select using (true);

drop policy if exists "public read" on public.veritaz_conferences;
create policy "public read" on public.veritaz_conferences for select using (true);

drop policy if exists "public read" on public.veritaz_events;
create policy "public read" on public.veritaz_events for select using (true);

drop policy if exists "public read" on public.veritaz_testimonials;
create policy "public read" on public.veritaz_testimonials for select using (true);

drop policy if exists "public read" on public.veritaz_team_contacts;
create policy "public read" on public.veritaz_team_contacts for select using (true);

-- Admin (authenticated) full read/write access
drop policy if exists "admin write" on public.veritaz_books;
create policy "admin write" on public.veritaz_books for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write" on public.veritaz_conferences;
create policy "admin write" on public.veritaz_conferences for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write" on public.veritaz_events;
create policy "admin write" on public.veritaz_events for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write" on public.veritaz_testimonials;
create policy "admin write" on public.veritaz_testimonials for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "admin write" on public.veritaz_team_contacts;
create policy "admin write" on public.veritaz_team_contacts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- veritaz_inquiries: anyone can submit (public contact forms), only admin can read/manage
drop policy if exists "public insert" on public.veritaz_inquiries;
create policy "public insert" on public.veritaz_inquiries for insert
  with check (true);

drop policy if exists "admin manage" on public.veritaz_inquiries;
create policy "admin manage" on public.veritaz_inquiries for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
