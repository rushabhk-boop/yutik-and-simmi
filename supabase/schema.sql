-- Guestbook for Yutik & Simmi.
-- Run this in the Supabase SQL editor, then set VITE_SUPABASE_URL and
-- VITE_SUPABASE_ANON_KEY. The anon key may insert rows. It cannot read them.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(guest_name) between 2 and 80),
  phone text,
  attending boolean not null,
  guest_count integer not null default 0 check (guest_count between 0 and 10),
  events text[] not null default '{}',
  message text check (message is null or char_length(message) <= 400),
  created_at timestamptz not null default now()
);

create unique index if not exists rsvps_guest_identity
  on public.rsvps (lower(guest_name), coalesce(phone, ''));

alter table public.rsvps enable row level security;

grant insert on public.rsvps to anon, authenticated;

drop policy if exists "Guests can send a reply" on public.rsvps;
create policy "Guests can send a reply"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);
