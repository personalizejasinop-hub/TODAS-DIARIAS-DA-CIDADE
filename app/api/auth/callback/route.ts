import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const { searchParams } = url
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const origin = url.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=auth_callback`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  // Sem o trigger handle_new_user, criamos o perfil aqui para OAuth (Google)
  if (data.user) {
    const meta = data.user.user_metadata ?? {}
    const role = meta.role === "contratante" ? "contratante" : "candidato"
    const name =
      (meta.full_name ?? meta.name ?? meta.user_name ?? data.user.email?.split("@")[0]) || ""
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        name: name || (data.user.email?.split("@")[0] ?? ""),
        email: data.user.email ?? "",
        phone: meta.phone ?? null,
        whatsapp: meta.phone ?? meta.whatsapp ?? null,
        role,
      },
      { onConflict: "id" }
    )
  }

  const safeNext = next.startsWith("/") ? next : "/"
  return NextResponse.redirect(`${origin}${safeNext}`)
}
