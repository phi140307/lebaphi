create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  last_login timestamptz,
  balance numeric(12, 2) not null default 0,
  deposit_code text,
  total_deposited numeric(12, 2) not null default 0,
  total_spent numeric(12, 2) not null default 0
);

create unique index if not exists users_username_lower_key on public.users (lower(username));
create unique index if not exists users_email_lower_key on public.users (lower(email));
create unique index if not exists users_deposit_code_key on public.users (deposit_code) where deposit_code is not null;

create or replace function public.set_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_users_updated_at();

create or replace function public.sync_auth_user_to_public_users()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    username,
    email,
    full_name,
    created_at,
    updated_at,
    status,
    last_login,
    balance,
    total_deposited,
    total_spent
  )
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1), new.id::text),
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.created_at, timezone('utc', now())),
    timezone('utc', now()),
    'active',
    new.last_sign_in_at,
    0,
    0,
    0
  )
  on conflict (id) do update
  set
    username = excluded.username,
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.users.full_name),
    last_login = coalesce(excluded.last_login, public.users.last_login),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_or_updated on auth.users;
create trigger on_auth_user_created_or_updated
after insert or update on auth.users
for each row
execute function public.sync_auth_user_to_public_users();

insert into public.users (
  id,
  username,
  email,
  full_name,
  created_at,
  updated_at,
  status,
  last_login,
  balance,
  total_deposited,
  total_spent
)
select
  au.id,
  coalesce(nullif(au.raw_user_meta_data ->> 'username', ''), split_part(au.email, '@', 1), au.id::text),
  au.email,
  nullif(au.raw_user_meta_data ->> 'full_name', ''),
  coalesce(au.created_at, timezone('utc', now())),
  timezone('utc', now()),
  'active',
  au.last_sign_in_at,
  0,
  0,
  0
from auth.users au
on conflict (id) do update
set
  username = excluded.username,
  email = excluded.email,
  full_name = coalesce(excluded.full_name, public.users.full_name),
  last_login = coalesce(excluded.last_login, public.users.last_login),
  updated_at = timezone('utc', now());

alter table public.users disable row level security;

grant select, insert, update, delete on public.users to anon;
grant select, insert, update, delete on public.users to authenticated;
grant select, insert, update, delete on public.users to service_role;
