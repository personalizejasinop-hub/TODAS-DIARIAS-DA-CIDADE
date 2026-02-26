create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text,
  whatsapp text,
  photo_url text,
  role text not null default 'candidato',
  active_mode text,
  onboarding_complete boolean not null default false,
  escolaridade text,
  interesse text,
  diarias_selecionadas text[] default '{}',
  disponibilidade text[] default '{}',
  horas_por_semana text,
  transporte text,
  cep text,
  endereco text,
  cpf text,
  cnpj text,
  empresa text,
  contratante_tipo text,
  raio_busca integer default 10,
  score_agilidade numeric(5,2) default 0,
  avaliacao_media numeric(3,2) default 0,
  total_avaliacoes integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
