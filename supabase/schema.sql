-- Run in Supabase SQL editor
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text,
  is_pro boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null,
  template_id text not null default 'classic',
  is_pro boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.resume_sections (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  type text not null,
  section_order integer not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id text not null,
  razorpay_payment_id text,
  amount integer not null,
  status text not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

drop trigger if exists resumes_set_updated_at on public.resumes;
create trigger resumes_set_updated_at
before update on public.resumes
for each row
execute function public.update_updated_at_column();

drop trigger if exists resume_sections_set_updated_at on public.resume_sections;
create trigger resume_sections_set_updated_at
before update on public.resume_sections
for each row
execute function public.update_updated_at_column();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
before update on public.payments
for each row
execute function public.update_updated_at_column();

create or replace function public.handle_new_user()
returns trigger as $$
declare
  local_username text;
begin
  local_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9]+', '-', 'g'));

  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    local_username || '-' || substr(md5(random()::text), 1, 4),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_sections enable row level security;
alter table public.payments enable row level security;

-- profiles policies
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- resumes policies
drop policy if exists resumes_select_own on public.resumes;
create policy resumes_select_own
on public.resumes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists resumes_insert_own on public.resumes;
create policy resumes_insert_own
on public.resumes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists resumes_update_own on public.resumes;
create policy resumes_update_own
on public.resumes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists resumes_delete_own on public.resumes;
create policy resumes_delete_own
on public.resumes
for delete
to authenticated
using (auth.uid() = user_id);

-- public read for share links
drop policy if exists resumes_select_public on public.resumes;
create policy resumes_select_public
on public.resumes
for select
to anon
using (true);

-- resume_sections policies
drop policy if exists resume_sections_select_own on public.resume_sections;
create policy resume_sections_select_own
on public.resume_sections
for select
to authenticated
using (
  exists (
    select 1
    from public.resumes r
    where r.id = resume_id and r.user_id = auth.uid()
  )
);

drop policy if exists resume_sections_write_own on public.resume_sections;
create policy resume_sections_write_own
on public.resume_sections
for all
to authenticated
using (
  exists (
    select 1
    from public.resumes r
    where r.id = resume_id and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.resumes r
    where r.id = resume_id and r.user_id = auth.uid()
  )
);

-- payments policies
drop policy if exists payments_select_own on public.payments;
create policy payments_select_own
on public.payments
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists payments_insert_own on public.payments;
create policy payments_insert_own
on public.payments
for insert
to authenticated
with check (auth.uid() = user_id);

-- storage bucket for profile photos
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

drop policy if exists photos_read_public on storage.objects;
create policy photos_read_public
on storage.objects
for select
to public
using (bucket_id = 'profile-photos');

drop policy if exists photos_upload_own on storage.objects;
create policy photos_upload_own
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists photos_update_own on storage.objects;
create policy photos_update_own
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists photos_delete_own on storage.objects;
create policy photos_delete_own
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text
);
