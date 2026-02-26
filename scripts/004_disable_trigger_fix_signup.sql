-- =============================================
-- FIX: "Database error creating new user"
-- =============================================
-- O trigger on_auth_user_created pode falhar por RLS ou contexto
-- e quebra o auth.admin.createUser. Desabilitamos o trigger e
-- os perfis sao criados pela API (/api/auth/signup) e pelo
-- callback OAuth (/api/auth/callback).
-- =============================================

drop trigger if exists on_auth_user_created on auth.users;
