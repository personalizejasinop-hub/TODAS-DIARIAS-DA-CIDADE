import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { mapVagaFromDb } from "@/lib/supabase/adapters"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Tenta com join ao contratante; se falhar (schema diferente), tenta sem join
  let res = await supabase
    .from("vagas")
    .select(`
      *,
      contratante:profiles!contratante_id(name, contratante_tipo, avaliacao_media)
    `)

  if (res.error) {
    const fallback = await supabase.from("vagas").select("*")
    if (fallback.error) {
      return NextResponse.json({ error: res.error.message }, { status: 400 })
    }
    res = fallback
  }

  const data = res.data

  const mapped = (data || []).map((row: Record<string, unknown>) => mapVagaFromDb(row))
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
  const requisitos = body.requisitos ?? []
  const requisitosVal = Array.isArray(requisitos)
    ? requisitos.join("\n")
    : String(requisitos ?? "")
  const valorNum = typeof body.valor === "number" ? body.valor : parseFloat(body.valor) || 0

  const payload: Record<string, unknown> = {
    titulo: body.titulo,
    categoria: body.categoria,
    categoria_id: body.categoriaId ?? body.categoria_id,
    descricao: body.descricao ?? "",
    requisitos: requisitosVal,
    valor: valorNum,
    tipo: body.tipo ?? "presencial",
    endereco: body.endereco ?? "",
    cidade: body.cidade ?? "",
    local: [body.endereco, body.cidade].filter(Boolean).join(", ") || body.endereco || body.cidade || null,
    data_inicio: body.dataInicio ?? body.data_inicio,
    data_fim: body.dataFim ?? body.data_fim,
    horario_inicio: body.horarioInicio ?? body.horario_inicio ?? null,
    horario_fim: body.horarioFim ?? body.horario_fim ?? null,
    qtd_vagas: body.qtdVagas ?? body.qtd_vagas ?? 1,
    status: body.status ?? "publicada",
    urgencia: body.urgencia ?? "normal",
    habilidades: body.habilidades ?? [],
    contratante_id: user.id,
  }

  const { data, error } = await supabase
    .from("vagas")
    .insert(payload)
    .select(`
      *,
      contratante:profiles!contratante_id(name, contratante_tipo, avaliacao_media)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(mapVagaFromDb(data), { status: 201 })
}
