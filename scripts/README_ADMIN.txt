ACESSO A AREA DE ADMIN
======================

1. CRIAR O ADMINISTRADOR (executar uma vez)

   No terminal, na pasta do projeto:

   Windows (PowerShell):
     $env:NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
     $env:SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role"
     pnpm run seed-admin

   Linux/Mac:
     NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co" \
     SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role" \
     pnpm run seed-admin

   A chave service_role esta em: Supabase Dashboard > Settings > API > service_role

2. ACESSAR O ADMIN

   - Abra o app na tela de boas-vindas
   - Toque 5 vezes em "todasdiariasdacidade.com.br" (texto no rodape)
   - Aparecera o botao "Acesso Administrador"
   - Clique nele e faça login com:
     Email: msdfernando@gmail.com
     Senha: Msd@0355

   Apenas usuarios com role=admin no banco podem acessar.
