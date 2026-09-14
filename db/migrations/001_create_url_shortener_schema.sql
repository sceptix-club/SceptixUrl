create extension if not exists pgcrypto;

create table if not exists urls (
  id uuid primary key default gen_random_uuid(),
  long_url text not null,
  short_code text not null unique,
  custom_alias text,
  created_at timestamptz not null default now(),
  click_count integer not null default 0,
  analytics_token text unique
);

create table if not exists clicks (
  id uuid primary key default gen_random_uuid(),
  short_code text not null references urls(short_code) on delete cascade,
  created_at timestamptz not null default now(),
  referrer text,
  user_agent text,
  ip text
);

create index if not exists idx_urls_short_code on urls(short_code);
create index if not exists idx_clicks_short_code on clicks(short_code);
create index if not exists idx_clicks_created_at on clicks(created_at);
