-- Supabase Database Schema for AI Client Brief Assistant

-- Automatic updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create briefs table
create table if not exists public.briefs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_title text not null check (char_length(trim(project_title)) > 0),
  client_name text,
  raw_request text not null check (char_length(trim(raw_request)) > 0),
  analysis jsonb not null,
  complexity text not null check (complexity in ('low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Performance Indexes
create index if not exists briefs_user_id_idx
  on public.briefs (user_id);

create index if not exists briefs_user_created_at_idx
  on public.briefs (user_id, created_at desc);

-- Trigger for updated_at
drop trigger if exists set_briefs_updated_at on public.briefs;
create trigger set_briefs_updated_at
  before update on public.briefs
  for each row
  execute function public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.briefs enable row level security;

-- Table Grants: Revoke all from anon, grant explicit permissions to authenticated
revoke all on table public.briefs from anon;
grant select, insert, update, delete on table public.briefs to authenticated;

-- RLS Policies (Idempotent policy creation)

-- SELECT policy: authenticated users can only view their own briefs
drop policy if exists "Users can view their own briefs" on public.briefs;
create policy "Users can view their own briefs"
  on public.briefs
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

-- INSERT policy: authenticated users can only insert briefs for themselves
drop policy if exists "Users can create their own briefs" on public.briefs;
create policy "Users can create their own briefs"
  on public.briefs
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

-- UPDATE policy: authenticated users can only update their own briefs
drop policy if exists "Users can update their own briefs" on public.briefs;
create policy "Users can update their own briefs"
  on public.briefs
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

-- DELETE policy: authenticated users can only delete their own briefs
drop policy if exists "Users can delete their own briefs" on public.briefs;
create policy "Users can delete their own briefs"
  on public.briefs
  for delete
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

