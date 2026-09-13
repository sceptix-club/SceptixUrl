create extension if not exists "uuid-ossp";

create table if not exists public.urls (
  id uuid primary key default uuid_generate_v4(),
  long_url text not null,
  short_code text not null unique,
  custom_alias text,
  created_at timestamptz not null default now(),
  click_count integer not null default 0,
  analytics_token text unique
);

create table if not exists public.clicks (
  id uuid primary key default uuid_generate_v4(),
  short_code text not null references public.urls(short_code) on delete cascade,
  created_at timestamptz not null default now(),
  referrer text,
  user_agent text,
  ip text
);

create index if not exists idx_urls_short_code on public.urls(short_code);
create index if not exists idx_clicks_short_code on public.clicks(short_code);
create index if not exists idx_clicks_created_at on public.clicks(created_at);

alter table public.urls enable row level security;
alter table public.clicks enable row level security;

create policy "Anyone can read URLs"
  on public.urls for select
  using (true);

create policy "Anyone can read clicks"
  on public.clicks for select
  using (true);
