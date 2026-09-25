-- One row the daily keepalive cron rewrites. A read alone did not stop the
-- free-tier inactivity warning, a write to the database does.
-- Only the service role touches it; the explicit grant keeps it reachable
-- through the Data API once new tables stop getting default grants.
create table if not exists public.keepalive (
  id         smallint primary key check (id = 1),
  touched_at timestamptz not null default now()
);

comment on table public.keepalive is 'Heartbeat row for the daily keepalive cron';

alter table public.keepalive enable row level security;

revoke all on public.keepalive from anon, authenticated;
grant select, insert, update on public.keepalive to service_role;

insert into public.keepalive (id) values (1) on conflict (id) do nothing;
