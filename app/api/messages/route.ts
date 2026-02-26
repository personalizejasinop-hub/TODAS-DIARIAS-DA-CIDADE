import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { mapMessageFromDb } from "@/lib/supabase/adapters"

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
    .from("messages")
    .select(`
      *,
      sender:profiles!sender_id(name, full_name)
    `)
    .order("created_at", { ascending: true })

  if (vagaId) {
    query = query.eq("vaga_id", vagaId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const mapped = (data || []).map((row) => {
    const m = mapMessageFromDb(row)
    const sender = row.sender as Record<string, unknown> | undefined
    if (sender?.name && row.sender_id === user.id) {
      ;(m as Record<string, unknown>).senderName = "Você"
    } else if (sender?.name) {
      ;(m as Record<string, unknown>).senderName = sender.name
    }
    return m
  })
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

  const textVal = body.text ?? body.content ?? ""
  const payload: Record<string, unknown> = {
    vaga_id: body.vagaId ?? body.vaga_id,
    receiver_id: body.receiverId ?? body.receiver_id,
    text: textVal,
    content: textVal,
    is_quick_action: body.isQuickAction ?? body.is_quick_action ?? false,
    sender_id: user.id,
  }

  const { data, error } = await supabase
    .from("messages")
    .insert(payload)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(mapMessageFromDb(data), { status: 201 })
}
