-- =============================================
-- Sincroniza schema do Supabase com o app
-- =============================================
-- Adiciona colunas que o app espera mas seu banco pode nao ter.
-- Execute no Supabase SQL Editor.
-- Se messages.candidatura_id for NOT NULL e o app falhar ao criar mensagem,
-- execute: ALTER TABLE public.messages ALTER COLUMN candidatura_id DROP NOT NULL;
-- =============================================

-- PROFILES: colunas usadas pelo app
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cep text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS endereco text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cnpj text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS empresa text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contratante_tipo text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS raio_busca integer DEFAULT 10;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bloquear_fora_raio boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avaliacao_media numeric(3,2) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_avaliacoes integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS horas_por_semana text;

-- VAGAS: colunas usadas pelo app (seu schema tem local, valor numeric, requisitos text)
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS endereco text;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS cidade text;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS qtd_vagas integer DEFAULT 1;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS qtd_candidatos integer DEFAULT 0;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS habilidades text[] DEFAULT '{}';
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS urgencia text DEFAULT 'normal';
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS categoria_id text;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS data_fim text;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS horario_fim text;

-- MESSAGES: app usa vaga_id e text (seu schema tem candidatura_id e content)
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS vaga_id uuid REFERENCES public.vagas(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS text text;

-- CANDIDATURAS: app usa status "enviada" (seu schema tem "pendente")
-- O adapter mapeia os status, mas para INSERT precisamos enviar um status valido
-- Adiciona "enviada" ao constraint se necessario
ALTER TABLE public.candidaturas DROP CONSTRAINT IF EXISTS candidaturas_status_check;
ALTER TABLE public.candidaturas ADD CONSTRAINT candidaturas_status_check CHECK (
  status IS NULL OR status = ANY (ARRAY[
    'pendente'::text, 'aceita'::text, 'recusada'::text, 'cancelada'::text, 'finalizada'::text,
    'enviada'::text, 'em_analise'::text, 'convidado'::text, 'selecionado'::text, 'recusado'::text, 'no_show'::text
  ])
);

-- VAGAS: permite status "publicada"
ALTER TABLE public.vagas DROP CONSTRAINT IF EXISTS vagas_status_check;
ALTER TABLE public.vagas ADD CONSTRAINT vagas_status_check CHECK (
  status IS NULL OR status = ANY (ARRAY['ativa'::text, 'pausada'::text, 'finalizada'::text, 'cancelada'::text, 'publicada'::text])
);
