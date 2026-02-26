-- =============================================
-- Visibilidade cruzada: empresas veem candidatos, candidatos veem empresas
-- =============================================
-- Permite que:
-- - Contratantes (role=contratante) vejam todos os perfis de candidatos
-- - Candidatos (role=candidato) vejam todos os perfis de contratantes
-- Execute no Supabase SQL Editor.
-- =============================================

-- Contratantes podem ver perfis de candidatos
DROP POLICY IF EXISTS "profiles_contratante_see_candidatos" ON public.profiles;
CREATE POLICY "profiles_contratante_see_candidatos" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'contratante'
    ) AND role = 'candidato'
  );

-- Candidatos podem ver perfis de contratantes
DROP POLICY IF EXISTS "profiles_candidato_see_contratantes" ON public.profiles;
CREATE POLICY "profiles_candidato_see_contratantes" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'candidato'
    ) AND role = 'contratante'
  );

-- Se profiles_select_own estiver restrito (auth.uid() = id), adicione as acima.
-- Se profiles_select_own tiver using(true), as políticas acima podem conflitar.
-- Nesse caso, remova ou ajuste profiles_select_own conforme necessário.
-- O Supabase usa OR entre políticas do mesmo tipo (SELECT), então ter múltiplas
-- políticas SELECT permite acesso se QUALQUER uma for satisfeita.
