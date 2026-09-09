-- Messages sent through the contact form on dk.punds.ch.
-- Written only by the Vercel function (service role); nothing is readable or
-- writable through the public API, which is what the policies below enforce.
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 254),
  subject     text not null check (char_length(subject) between 1 and 200),
  message     text not null check (char_length(message) between 1 and 5000),
  intent      text,                       -- job | freelance | collab | other | service
  language    text,                       -- en | de | fr | zh
  ip_hash     text,                       -- sha256 of the sender IP, for the rate limit only
  user_agent  text,
  notified_at timestamptz,                -- when the e-mail to Dominik went out
  read_at     timestamptz
);

comment on table public.contact_messages is 'Contact form submissions from dk.punds.ch';

alter table public.contact_messages enable row level security;
-- No policies on purpose: with RLS on and no policy, anon and authenticated
-- roles can neither read nor write. The service role bypasses RLS.

revoke all on public.contact_messages from anon, authenticated;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_ip_hash_created_idx
  on public.contact_messages (ip_hash, created_at desc);
