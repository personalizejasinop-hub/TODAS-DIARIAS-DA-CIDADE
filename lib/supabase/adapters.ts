/** Converte registros do Supabase (snake_case) para o formato do app (camelCase) */

export function mapVagaFromDb(row: Record<string, unknown>): Record<string, unknown> {
  const contratante = row.contratante as Record<string, unknown> | undefined
  const valor = row.valor
  const valorStr = typeof valor === "number" ? String(valor) : (valor as string) ?? ""
  const dataInicio = row.data_inicio ?? row.dataInicio
  const dataInicioStr =
    dataInicio instanceof Date
      ? dataInicio.toISOString().slice(0, 10)
      : dataInicio != null
        ? String(dataInicio)
        : ""
  const horarioInicio = row.horario_inicio ?? row.horarioInicio
  const horarioInicioStr =
    horarioInicio != null ? String(horarioInicio).replace(/^(\d{2}:\d{2}).*/, "$1") : ""
  const requisitos = row.requisitos
  const requisitosArr = Array.isArray(requisitos)
    ? requisitos
    : typeof requisitos === "string"
      ? requisitos.split("\n").filter(Boolean)
      : []
  return {
    id: row.id,
    titulo: row.titulo ?? "",
    categoria: row.categoria ?? "",
    categoriaId: row.categoria_id ?? row.categoriaId,
    descricao: row.descricao ?? "",
    requisitos: requisitosArr,
    valor: valorStr,
    tipo: row.tipo ?? "presencial",
    endereco: row.endereco ?? row.local ?? "",
    cidade: row.cidade ?? "",
    dataInicio: dataInicioStr,
    dataFim: row.data_fim != null ? String(row.data_fim) : "",
    horarioInicio: horarioInicioStr,
    horarioFim: row.horario_fim != null ? String(row.horario_fim).replace(/^(\d{2}:\d{2}).*/, "$1") : "",
    qtdVagas: row.qtd_vagas ?? row.qtdVagas ?? 1,
    qtdCandidatos: row.qtd_candidatos ?? row.qtdCandidatos ?? 0,
    status: row.status ?? "publicada",
    urgencia: row.urgente ? "alta" : (row.urgencia as string) ?? "normal",
    contratanteId: row.contratante_id ?? row.contratanteId,
    contratanteNome: contratante?.name ?? contratante?.full_name ?? row.contratante_nome ?? "Contratante",
    contratanteTipo: (contratante?.contratante_tipo ?? row.contratante_tipo ?? "pf") as "pf" | "pj",
    contratanteAvaliacao: Number(contratante?.avaliacao_media ?? row.contratante_avaliacao ?? 0),
    contratanteTempoPlataforma: (row.contratante_tempo_plataforma as string) ?? "Recém-chegado",
    habilidades: row.habilidades ?? row.dias_semana ?? [],
    criadaEm: row.created_at ?? row.criadaEm ?? new Date().toISOString(),
  }
}

export function mapCandidaturaFromDb(row: Record<string, unknown>): Record<string, unknown> {
  const vaga = row.vaga as Record<string, unknown> | undefined
  const contratante = (vaga?.contratante as Record<string, unknown>) ?? (row.contratante as Record<string, unknown>)
  const candidato = row.candidato as Record<string, unknown> | undefined
  const local = [vaga?.endereco, vaga?.cidade, vaga?.local].filter(Boolean).join(", ") || ""
  const vagaValor = vaga?.valor ?? row.vaga_valor
  const vagaValorStr = typeof vagaValor === "number" ? String(vagaValor) : (vagaValor as string) ?? ""
  const vagaData = vaga?.data_inicio ?? row.vaga_data
  const vagaDataStr = vagaData instanceof Date ? (vagaData as Date).toISOString().slice(0, 10) : vagaData != null ? String(vagaData) : ""
  const status = row.status as string
  const statusMap: Record<string, string> = { pendente: "enviada", aceita: "selecionado", recusada: "recusado", cancelada: "cancelado", finalizada: "concluida" }
  const mappedStatus = statusMap[status ?? ""] ?? status ?? "enviada"
  return {
    id: row.id,
    vagaId: row.vaga_id ?? row.vagaId ?? vaga?.id,
    vagaTitulo: (vaga?.titulo as string) ?? row.vaga_titulo ?? "",
    vagaValor: vagaValorStr,
    vagaData: vagaDataStr,
    vagaLocal: String(local || row.vaga_local || ""),
    candidatoId: row.candidato_id ?? row.candidatoId ?? candidato?.id,
    candidatoNome: (candidato?.name as string) ?? (candidato?.full_name as string) ?? row.candidato_nome ?? "",
    contratanteId: row.contratante_id ?? vaga?.contratante_id,
    contratanteNome: (contratante?.name as string) ?? (contratante?.full_name as string) ?? row.contratante_nome ?? "",
    status: mappedStatus,
    mensagemInicial: row.mensagem_inicial ?? row.mensagemInicial,
    criadaEm: row.created_at ?? row.criadaEm ?? new Date().toISOString(),
  }
}

export function mapProfileFromDb(row: Record<string, unknown>): Record<string, unknown> {
  const name = row.name ?? row.full_name ?? ""
  return {
    id: row.id,
    name: String(name),
    email: String(row.email ?? ""),
    phone: row.phone ?? row.phone,
    whatsapp: row.whatsapp ?? row.phone,
    photoUrl: row.photo_url ?? row.avatar_url ?? row.photoUrl,
    role: row.role ?? "candidato",
    activeMode: row.active_mode ?? row.activeMode,
    onboardingComplete: row.onboarding_complete ?? row.onboardingComplete ?? false,
    escolaridade: row.escolaridade,
    interesse: row.interesse,
    diariasSelecionadas: row.diarias_selecionadas ?? row.diariasSelecionadas ?? [],
    disponibilidade: row.disponibilidade ?? [],
    horasPorSemana: row.horas_por_semana ?? row.horas_semana ?? row.horasPorSemana,
    transporte: row.transporte,
    cep: row.cep,
    endereco: row.endereco,
    cpf: row.cpf,
    cnpj: row.cnpj,
    empresa: row.empresa,
    contratanteTipo: row.contratante_tipo ?? row.contratanteTipo,
    raioBusca: row.raio_busca ?? row.raioBusca ?? 10,
    bloquearForaRaio: row.bloquear_fora_raio ?? row.bloquearForaRaio,
    scoreAgilidade: row.score_agilidade ?? row.scoreAgilidade ?? 0,
    avaliacaoMedia: row.avaliacao_media ?? row.avaliacaoMedia ?? 0,
    totalAvaliacoes: row.total_avaliacoes ?? row.totalAvaliacoes ?? 0,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
  }
}

export function mapMessageFromDb(row: Record<string, unknown>): Record<string, unknown> {
  return {
    id: row.id,
    vagaId: row.vaga_id ?? row.vagaId,
    candidaturaId: row.candidatura_id ?? row.candidaturaId,
    senderId: row.sender_id ?? row.senderId,
    senderName: row.sender_name ?? "",
    text: row.text ?? row.content ?? "",
    isQuickAction: row.is_quick_action ?? row.isQuickAction ?? false,
    timestamp: row.created_at ?? row.timestamp ?? "",
  }
}
