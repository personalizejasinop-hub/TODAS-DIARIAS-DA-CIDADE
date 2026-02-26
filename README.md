# Todas Diárias da Cidade

Marketplace de diárias conectando candidatos e contratantes.

## Stack

- **Next.js 16** + React 19
- **Supabase** (auth, banco)
- **Zustand** (estado)
- **Tailwind CSS**
- **SWR** (fetch/cache)

## Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)
- Conta no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com) (para deploy)

## Configuração local

1. Clone o repositório e instale dependências:

```bash
pnpm install
```

2. Crie o arquivo `.env` na raiz (copie de `.env.example`):

```bash
cp .env.example .env
```

3. Preencha as variáveis no `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL` – URL do projeto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Chave anônima
   - `SUPABASE_SERVICE_ROLE_KEY` – Chave service_role (necessária para cadastro)

4. Execute os scripts SQL no Supabase (SQL Editor), na ordem:
   - `scripts/001_create_tables.sql` – Tabelas base
   - `scripts/002_profiles.sql` – Ajustes em profiles
   - `scripts/004_disable_trigger_fix_signup.sql` – Corrige erro no cadastro
   - `scripts/005_add_email_to_profiles.sql` – Colunas em profiles
   - `scripts/006_sync_schema_com_app.sql` – Sincroniza schema

5. Rode o projeto:

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Conecte o repositório ao Vercel
2. Em **Settings > Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Faça o deploy

## Estrutura principal

```
app/              # Rotas Next.js (App Router)
components/       # Componentes React
lib/              # Store, auth, hooks, Supabase
scripts/          # SQL para Supabase
```

## Fluxos

- **Candidato:** Cadastro → Onboarding (escolaridade, interesse, diárias, disponibilidade) → Home
- **Contratante:** Cadastro → Onboarding (tipo PF/PJ, dados, áreas) → Minhas Vagas
