-- ============================================================================
-- REISEGALERIE — DATENBANK-SCHEMA
-- ============================================================================
-- Führe dieses komplette Skript einmal im Supabase SQL-Editor aus
-- (Anleitung: README.md, Abschnitt "Supabase einrichten").
-- ============================================================================

-- -- Tabelle: Reisen --------------------------------------------------------
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  start_date date,
  end_date date,
  description text,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  created_at timestamptz not null default now()
);

-- -- Tabelle: Fotos ----------------------------------------------------------
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  storage_path text not null,
  title text,
  description text,
  location text,
  taken_at timestamptz not null default now(),
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists photos_trip_id_idx on public.photos (trip_id);
create index if not exists photos_taken_at_idx on public.photos (taken_at);
create index if not exists trips_start_date_idx on public.trips (start_date);

-- -- Row Level Security --------------------------------------------------------
-- Grundprinzip:
--   * Jeder (auch ohne Login) darf öffentliche ("public") Reisen/Fotos lesen.
--   * Nur eingeloggte Nutzer (= der Administrator) dürfen private Inhalte lesen.
--   * Nur eingeloggte Nutzer dürfen Daten anlegen, ändern oder löschen.
-- Da es nur einen einzigen Admin-Account gibt, reicht "eingeloggt = Admin".

alter table public.trips enable row level security;
alter table public.photos enable row level security;

create policy "Öffentliche Reisen für alle sichtbar"
  on public.trips for select
  using (visibility = 'public' or auth.role() = 'authenticated');

create policy "Öffentliche Fotos für alle sichtbar"
  on public.photos for select
  using (visibility = 'public' or auth.role() = 'authenticated');

create policy "Nur eingeloggt: Reisen verwalten"
  on public.trips for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Nur eingeloggt: Fotos verwalten"
  on public.photos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE (Bilderspeicher)
-- ============================================================================
-- Lege im Supabase Dashboard unter "Storage" einen Bucket namens "photos" an
-- (Public Bucket = aktiviert, siehe README.md). Danach dieses Skript ausführen,
-- um die Zugriffsregeln für den Bucket zu setzen.

create policy "Fotos oeffentlich lesbar"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "Nur eingeloggt: Fotos hochladen"
  on storage.objects for insert
  with check (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Nur eingeloggt: Fotos aktualisieren"
  on storage.objects for update
  using (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Nur eingeloggt: Fotos loeschen"
  on storage.objects for delete
  using (bucket_id = 'photos' and auth.role() = 'authenticated');
