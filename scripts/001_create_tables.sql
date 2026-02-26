-- =============================================
-- Todas Diarias da Cidade - Database Schema
-- =============================================

-- 1. PROFILES table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text,
  whatsapp text,
  photo_url text,
  role text not null default 'candidato' check (role in ('candidato', 'contratante', 'admin')),
  active_mode text check (active_mode in ('candidato', 'contratante')),
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
  contratante_tipo text check (contratante_tipo in ('pf', 'pj')),
  raio_busca integer default 10,
  bloquear_fora_raio boolean default false,
  score_agilidade numeric(5,2) default 0,
  avaliacao_media numeric(3,2) default 0,
  total_avaliacoes integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Admins can see all profiles
create policy "profiles_admin_select" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 2. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'candidato'),
    coalesce(new.raw_user_meta_data ->> 'phone', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 3. DIARIAS CATEGORIES table (admin-managed)
create table if not exists public.diarias_categories (
  id text primary key,
  name text not null,
  icon text default 'category',
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table public.diarias_categories enable row level security;
create policy "diarias_categories_public_read" on public.diarias_categories
  for select using (true);
create policy "diarias_categories_admin_insert" on public.diarias_categories
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "diarias_categories_admin_update" on public.diarias_categories
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 4. DIARIAS ITEMS table (items inside categories)
create table if not exists public.diarias_items (
  id text primary key,
  category_id text not null references public.diarias_categories(id) on delete cascade,
  label text not null,
  active boolean not null default true,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table public.diarias_items enable row level security;
create policy "diarias_items_public_read" on public.diarias_items
  for select using (true);
create policy "diarias_items_admin_insert" on public.diarias_items
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "diarias_items_admin_update" on public.diarias_items
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 5. VAGAS table
create table if not exists public.vagas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  categoria text not null,
  categoria_id text,
  descricao text not null default '',
  requisitos text[] default '{}',
  valor text not null default '',
  tipo text not null default 'presencial' check (tipo in ('presencial', 'home_office')),
  endereco text default '',
  cidade text default '',
  data_inicio text not null default '',
  data_fim text,
  horario_inicio text default '',
  horario_fim text default '',
  qtd_vagas integer default 1,
  qtd_candidatos integer default 0,
  status text not null default 'publicada' check (status in ('rascunho','publicada','pausada','preenchida','em_andamento','concluida','cancelada','expirada')),
  urgencia text default 'normal' check (urgencia in ('alta','media','normal')),
  contratante_id uuid not null references public.profiles(id) on delete cascade,
  habilidades text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vagas enable row level security;
-- Everyone can see published vagas
create policy "vagas_public_read" on public.vagas
  for select using (status = 'publicada' or contratante_id = auth.uid());
create policy "vagas_contratante_insert" on public.vagas
  for insert with check (auth.uid() = contratante_id);
create policy "vagas_contratante_update" on public.vagas
  for update using (auth.uid() = contratante_id);
create policy "vagas_contratante_delete" on public.vagas
  for delete using (auth.uid() = contratante_id);
-- Admins can see all
create policy "vagas_admin_select" on public.vagas
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 6. CANDIDATURAS table
create table if not exists public.candidaturas (
  id uuid primary key default gen_random_uuid(),
  vaga_id uuid not null references public.vagas(id) on delete cascade,
  candidato_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'enviada' check (status in ('enviada','em_analise','convidado','selecionado','recusado','cancelado','no_show')),
  mensagem_inicial text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.candidaturas enable row level security;
create policy "candidaturas_candidato_select" on public.candidaturas
  for select using (auth.uid() = candidato_id);
create policy "candidaturas_candidato_insert" on public.candidaturas
  for insert with check (auth.uid() = candidato_id);
create policy "candidaturas_contratante_select" on public.candidaturas
  for select using (
    exists (select 1 from public.vagas v where v.id = vaga_id and v.contratante_id = auth.uid())
  );
create policy "candidaturas_contratante_update" on public.candidaturas
  for update using (
    exists (select 1 from public.vagas v where v.id = vaga_id and v.contratante_id = auth.uid())
  );

-- 7. MESSAGES table (chat per vaga)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  vaga_id uuid not null references public.vagas(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  is_quick_action boolean default false,
  read boolean default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
create policy "messages_participant_select" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "messages_sender_insert" on public.messages
  for insert with check (auth.uid() = sender_id);
create policy "messages_receiver_update" on public.messages
  for update using (auth.uid() = receiver_id);

-- 8. AVALIACOES table
create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  avaliador_id uuid not null references public.profiles(id) on delete cascade,
  avaliado_id uuid not null references public.profiles(id) on delete cascade,
  vaga_id uuid not null references public.vagas(id) on delete cascade,
  nota integer not null check (nota >= 1 and nota <= 5),
  comentario text,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.avaliacoes enable row level security;
create policy "avaliacoes_public_read" on public.avaliacoes
  for select using (true);
create policy "avaliacoes_author_insert" on public.avaliacoes
  for insert with check (auth.uid() = avaliador_id);

-- 9. DENUNCIAS table
create table if not exists public.denuncias (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('usuario', 'vaga')),
  reportado_id text not null,
  reportado_nome text not null default '',
  denunciante_id uuid not null references public.profiles(id) on delete cascade,
  motivo text not null,
  descricao text default '',
  status text not null default 'pendente' check (status in ('pendente','analisando','resolvida','descartada')),
  created_at timestamptz not null default now()
);

alter table public.denuncias enable row level security;
create policy "denuncias_author_insert" on public.denuncias
  for insert with check (auth.uid() = denunciante_id);
create policy "denuncias_author_select" on public.denuncias
  for select using (auth.uid() = denunciante_id);
create policy "denuncias_admin_all" on public.denuncias
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 10. Updated_at trigger function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger vagas_updated_at before update on public.vagas
  for each row execute function public.update_updated_at();
create trigger candidaturas_updated_at before update on public.candidaturas
  for each row execute function public.update_updated_at();
