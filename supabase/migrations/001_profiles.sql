-- profiles table: one row per authenticated user
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  phone     text not null,
  full_name text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles: self read"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile (once, on signup)
create policy "profiles: self insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);
