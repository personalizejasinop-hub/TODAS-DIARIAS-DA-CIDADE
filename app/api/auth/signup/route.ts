import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Configuracao do servidor incompleta. Contate o suporte." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, password, name, phone, role } = body

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha sao obrigatorios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    const validRole = role === "contratante" ? "contratante" : "candidato"
    const supabase = createAdminClient()

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: validRole,
        name: name || email.split("@")[0],
        phone: phone || null,
      },
    })

    if (authError) {
      if (authError.message?.includes("already been registered") || authError.message?.includes("already exists")) {
        return NextResponse.json({ error: "Este e-mail ja esta cadastrado" }, { status: 400 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Erro ao criar usuario" }, { status: 500 })
    }

    const profileRow = {
      id: authData.user.id,
      name: name || authData.user.user_metadata?.name || email.split("@")[0],
      email: email,
      phone: phone || null,
      whatsapp: phone || null,
      role: validRole,
    }

    const { data: profileData, error: profileError } = await supabase.from("profiles").upsert(
      profileRow,
      { onConflict: "id" }
    ).select().single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    const profile = profileData
      ? {
          id: profileData.id,
          name: profileData.name ?? profileRow.name,
          email: profileData.email ?? profileRow.email,
          phone: profileData.phone ?? profileRow.phone,
          whatsapp: profileData.whatsapp ?? profileData.phone ?? profileRow.phone,
          role: profileData.role ?? profileRow.role,
          onboardingComplete: Boolean(profileData.onboarding_complete ?? profileData.onboardingComplete),
        }
      : profileRow

    return NextResponse.json({ ok: true, userId: authData.user.id, profile })
  } catch (e) {
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 })
  }
}
