import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { mapProfileFromDb } from "@/lib/supabase/adapters"

/**
 * Lista todos os candidatos cadastrados.
 * Acesso: apenas contratantes (empresas).
 */
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (myProfile?.role !== "contratante" && myProfile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado. Apenas contratantes." }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "candidato")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const mapped = (data || []).map((row) => mapProfileFromDb(row))
  return NextResponse.json(mapped)
}
