-- Kaban cloud sync: one JSON document per signed-in person.
-- Paste this into the Supabase dashboard under SQL Editor and run it.

create table if not exists public.kaban_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb       not null,
  updated_at timestamptz not null default now()
);

alter table public.kaban_state enable row level security;

-- Each person can only ever see and change their own row.
-- This is what makes it safe to use the publishable key in a public app.
drop policy if exists "read own state"   on public.kaban_state;
drop policy if exists "insert own state" on public.kaban_state;
drop policy if exists "update own state" on public.kaban_state;

create policy "read own state"
  on public.kaban_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "insert own state"
  on public.kaban_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "update own state"
  on public.kaban_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Required when the project does not expose new public tables automatically.
grant select, insert, update on public.kaban_state to authenticated;
