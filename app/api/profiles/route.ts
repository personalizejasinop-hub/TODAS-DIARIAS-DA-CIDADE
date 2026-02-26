import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { mapProfileFromDb } from "@/lib/supabase/adapters"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(mapProfileFromDb(data))
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const payload: Record<string, unknown> = {}
  const snakeMap: Record<string, string> = {
    photoUrl: "photo_url",
    activeMode: "active_mode",
    onboardingComplete: "onboarding_complete",
    diariasSelecionadas: "diarias_selecionadas",
    horasPorSemana: "horas_por_semana",
    contratanteTipo: "contratante_tipo",
    raioBusca: "raio_busca",
    bloquearForaRaio: "bloquear_fora_raio",
    scoreAgilidade: "score_agilidade",
    avaliacaoMedia: "avaliacao_media",
    totalAvaliacoes: "total_avaliacoes",
  }
  for (const [k, v] of Object.entries(body)) {
    if (v === undefined) continue
    const dbKey = snakeMap[k] ?? k
    payload[dbKey] = v
  }

  const nameVal = (payload.name as string) ?? user.user_metadata?.name ?? user.email ?? ""
  const emailVal = (payload.email as string) ?? user.email ?? ""
  const row: Record<string, unknown> = {
    id: user.id,
    name: nameVal,
    email: emailVal,
    full_name: nameVal,
    ...payload,
  }
  if (payload.photo_url !== undefined) row.avatar_url = payload.photo_url
  if (payload.horas_por_semana !== undefined) row.horas_semana = payload.horas_por_semana

  const { data, error } = await supabase
    .from("profiles")
    .upsert(row, { onConflict: "id" })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(mapProfileFromDb(data))
}
