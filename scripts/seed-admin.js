/**
 * Script para criar o administrador unico no Supabase.
 * Execute: node scripts/seed-admin.js
 *
 * Variaveis de ambiente necessarias:
 *   NEXT_PUBLIC_SUPABASE_URL - URL do projeto Supabase
 *   SUPABASE_SERVICE_ROLE_KEY - Chave service_role (Dashboard > Settings > API)
 *
 * Credenciais do admin:
 *   Email: msdfernando@gmail.com
 *   Senha: Msd@0355
 */

const { createClient } = require("@supabase/supabase-js")

const ADMIN_EMAIL = "msdfernando@gmail.com"
const ADMIN_PASSWORD = "Msd@0355"

async function seedAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.error("ERRO: Configure as variaveis de ambiente:")
    console.error("  NEXT_PUBLIC_SUPABASE_URL")
    console.error("  SUPABASE_SERVICE_ROLE_KEY")
    console.error("")
    console.error("Exemplo: $env:SUPABASE_SERVICE_ROLE_KEY='sua-chave'; node scripts/seed-admin.js")
    process.exit(1)
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log("Criando usuario administrador...")

  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      role: "admin",
      name: "Administrador",
    },
  })

  if (error) {
    if (error.message?.includes("already been registered") || error.code === "user_already_exists") {
      console.log("Usuario ja existe. Atualizando perfil para role admin...")
      const { data: users } = await supabase.auth.admin.listUsers()
      const adminUser = users?.users?.find((u) => u.email === ADMIN_EMAIL)
      if (adminUser) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin", name: "Administrador" })
          .eq("id", adminUser.id)
        if (updateError) {
          console.error("Erro ao atualizar perfil:", updateError.message)
          process.exit(1)
        }
        console.log("Perfil atualizado com sucesso!")
      }
    } else {
      console.error("Erro ao criar admin:", error.message)
      process.exit(1)
    }
  } else {
    console.log("Administrador criado com sucesso!")
    console.log("  ID:", data.user?.id)
    console.log("  Email:", ADMIN_EMAIL)
  }

  console.log("")
  console.log("Para acessar o admin:")
  console.log("  1. Toque 5 vezes em 'todasdiariasdacidade.com.br' na tela de boas-vindas")
  console.log("  2. Clique em 'Acesso Administrador'")
  console.log("  3. Faça login com:", ADMIN_EMAIL)
  console.log("  4. Senha:", ADMIN_PASSWORD)
  console.log("")
}

seedAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
