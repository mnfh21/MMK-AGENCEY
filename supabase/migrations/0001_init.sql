create extension if not exists pgcrypto;

create type project_status as enum ('new','under_review','awaiting_client','quoted','approved','in_progress','completed','cancelled');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- Admin check is derived from the profiles table, never from request payloads.
create function is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null check (email = lower(email)),
  phone text,
  country text not null,
  created_at timestamptz not null default now()
);
create unique index clients_email_key on clients (email);

create table projects (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  idempotency_key uuid not null unique,
  client_id uuid not null references clients(id) on delete restrict,
  project_type text not null,
  budget text not null,
  timeline text,
  config jsonb not null,
  status project_status not null default 'new',
  agreed_price numeric(12,2) check (agreed_price >= 0),
  expected_delivery date,
  archived boolean not null default false,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_status_idx on projects (status, submitted_at desc);
create index projects_client_idx on projects (client_id);

create table project_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  admin_id uuid not null references auth.users(id),
  content text not null check (length(content) between 1 and 5000),
  created_at timestamptz not null default now()
);

create table project_status_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  from_status project_status,
  to_status project_status not null,
  changed_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  type text not null,
  recipient text not null,
  status text not null check (status in ('pending','sent','failed')),
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);

create table agency_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create function touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger projects_touch before update on projects for each row execute function touch_updated_at();

create function log_status_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into project_status_history (project_id, from_status, to_status) values (new.id, old.status, new.status);
  end if;
  return new;
end $$;
create trigger projects_status_log after update on projects for each row execute function log_status_change();

-- RLS: deny by default. Public submissions go through the server route (service role), never directly.
alter table profiles enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table project_notes enable row level security;
alter table project_status_history enable row level security;
alter table notifications enable row level security;
alter table agency_settings enable row level security;

create policy "own profile readable" on profiles for select using (id = auth.uid());
create policy "admin all clients" on clients for all using (is_admin()) with check (is_admin());
create policy "admin all projects" on projects for all using (is_admin()) with check (is_admin());
create policy "admin all notes" on project_notes for all using (is_admin()) with check (is_admin() and admin_id = auth.uid());
create policy "admin read history" on project_status_history for select using (is_admin());
create policy "admin all notifications" on notifications for all using (is_admin()) with check (is_admin());
create policy "admin all settings" on agency_settings for all using (is_admin()) with check (is_admin());
-- No insert/update policy on profiles: promote the first admin manually in the SQL editor:
--   update profiles set role = 'admin' where id = '<auth user uuid>';
