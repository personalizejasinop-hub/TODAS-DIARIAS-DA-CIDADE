import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { mapCandidaturaFromDb } from "@/lib/supabase/adapters"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const vagaId = searchParams.get("vagaId")

  let query = supabase
    .from("candidaturas")
    .select(`
      *,
      vaga:vagas(id, titulo, valor, data_inicio, endereco, cidade, local, contratante_id, contratante:profiles!contratante_id(name, full_name)),
      candidato:profiles!candidato_id(id, name, full_name)
    `)

  if (vagaId) {
    query = query.eq("vaga_id", vagaId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const mapped = (data || []).map((row) => mapCandidaturaFromDb(row))
  return NextResponse.json(mapped)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const payload = {
    vaga_id: body.vagaId ?? body.vaga_id,
    candidato_id: user.id,
    status: "enviada",
    mensagem_inicial: body.mensagemInicial ?? body.mensagem_inicial,
  }

  const { data, error } = await supabase
    .from("candidaturas")
    .insert(payload)
    .select(`
      *,
      vaga:vagas(id, titulo, valor, data_inicio, endereco, cidade, local)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(mapCandidaturaFromDb(data), { status: 201 })
}
