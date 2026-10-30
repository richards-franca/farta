-- Landing page access requests. The LP runtime has access only to these tables.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'farta_lp_runtime') then
    create role farta_lp_runtime nologin;
  end if;
end $$;

create table public.lp_access_requests (
  id uuid primary key default gen_random_uuid(),
  request_key uuid not null unique,
  contact_name text not null check (char_length(btrim(contact_name)) between 1 and 120),
  company_name text not null check (char_length(btrim(company_name)) between 1 and 160),
  email text not null check (char_length(email) between 3 and 320),
  city text not null check (char_length(btrim(city)) between 1 and 120),
  state text not null check (state ~ '^[A-Z]{2}$'),
  whatsapp text check (whatsapp is null or whatsapp ~ '^[0-9]{10,11}$'),
  business_type text check (business_type is null or business_type in ('RETAIL','FOOD','SERVICES','INDUSTRY','OTHER','UNDISCLOSED')),
  status text not null default 'PENDING' check (status in ('PENDING','IN_CONTACT','APPROVED','REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lp_access_request_history (
  id bigint generated always as identity primary key,
  request_id uuid not null references public.lp_access_requests(id) on delete restrict,
  status text not null check (status in ('PENDING','IN_CONTACT','APPROVED','REJECTED')),
  note text check (note is null or char_length(note) <= 2000),
  actor_profile_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index lp_access_requests_status_created_idx on public.lp_access_requests(status, created_at desc);
create index lp_access_requests_created_idx on public.lp_access_requests(created_at desc);
create index lp_access_request_history_request_idx on public.lp_access_request_history(request_id, created_at);

alter table public.lp_access_requests enable row level security;
alter table public.lp_access_request_history enable row level security;
revoke all on public.lp_access_requests, public.lp_access_request_history from public, anon, authenticated;
grant usage on schema public to farta_lp_runtime;
grant select, insert on public.lp_access_requests to farta_lp_runtime;
grant update (status, updated_at) on public.lp_access_requests to farta_lp_runtime;
grant select, insert on public.lp_access_request_history to farta_lp_runtime;
grant usage, select on sequence public.lp_access_request_history_id_seq to farta_lp_runtime;

create policy lp_runtime_requests on public.lp_access_requests
  for all to farta_lp_runtime using (true) with check (true);
create policy lp_runtime_history on public.lp_access_request_history
  for all to farta_lp_runtime using (true) with check (true);

comment on table public.lp_access_requests is 'Solicitações de acesso da landing page; não cria conta nem convite.';
comment on table public.lp_access_request_history is 'Mudanças de status e notas internas auditadas do portal.';
