export type EscolaridadeOption =
  | "fundamental_incompleto"
  | "fundamental_completo"
  | "medio_incompleto"
  | "medio_completo"
  | "tecnico"
  | "superior_incompleto"
  | "superior_completo"

export type InteresseOption =
  | "sim_whatsapp"
  | "sim_fds"
  | "sim_semana"
  | "talvez"
  | "nao"

export type DisponibilidadeOption =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo"
  | "manha"
  | "tarde"
  | "noite"

export type HorasOption = "2h" | "4h" | "6h" | "8h+"

export type TransporteOption = "nao" | "bicicleta" | "moto" | "carro"

export interface DiariasCategory {
  id: string
  name: string
  icon: string
  items: DiariasItem[]
}

export interface DiariasItem {
  id: string
  label: string
  active: boolean
}

// Vaga statuses
export type VagaStatus =
  | "rascunho"
  | "publicada"
  | "pausada"
  | "preenchida"
  | "em_andamento"
  | "concluida"
  | "cancelada"
  | "expirada"

// Candidatura statuses
export type CandidaturaStatus =
  | "enviada"
  | "em_analise"
  | "convidado"
  | "selecionado"
  | "recusado"
  | "cancelado"
  | "no_show"

export type ContratanteTipo = "pf" | "pj"

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  photoUrl?: string
  role: "candidato" | "contratante" | "admin"
  activeMode?: "candidato" | "contratante"
  onboardingComplete: boolean
  escolaridade?: EscolaridadeOption
  interesse?: InteresseOption
  diariasSelecionadas: string[]
  disponibilidade: DisponibilidadeOption[]
  horasPorSemana?: HorasOption
  transporte?: TransporteOption
  cep?: string
  endereco?: string
  cpf?: string
  cnpj?: string
  empresa?: string
  contratanteTipo?: ContratanteTipo
  raioBusca?: number
  bloquearForaRaio?: boolean
  scoreAgilidade?: number
  avaliacaoMedia?: number
  totalAvaliacoes?: number
  createdAt: string
}

export interface OnboardingData {
  escolaridade?: EscolaridadeOption
  interesse?: InteresseOption
  whatsapp?: string
  diariasSelecionadas: string[]
  disponibilidade: DisponibilidadeOption[]
  horasPorSemana?: HorasOption
  transporte?: TransporteOption
}

export interface Vaga {
  id: string
  titulo: string
  categoria: string
  categoriaId: string
  descricao: string
  requisitos: string[]
  valor: string
  tipo: "presencial" | "home_office"
  endereco: string
  cidade: string
  dataInicio: string
  dataFim?: string
  horarioInicio: string
  horarioFim: string
  qtdVagas: number
  qtdCandidatos: number
  status: VagaStatus
  urgencia: "alta" | "media" | "normal"
  contratanteId: string
  contratanteNome: string
  contratanteTipo: ContratanteTipo
  contratanteAvaliacao: number
  contratanteTempoPlataforma: string
  distancia?: string
  habilidades: string[]
  criadaEm: string
}

export interface Candidatura {
  id: string
  vagaId: string
  vagaTitulo: string
  vagaValor: string
  vagaData: string
  vagaLocal: string
  candidatoId: string
  candidatoNome: string
  contratanteId: string
  contratanteNome: string
  status: CandidaturaStatus
  mensagemInicial?: string
  criadaEm: string
}

export interface ChatMessage {
  id: string
  vagaId: string
  senderId: string
  senderName: string
  text: string
  isQuickAction?: boolean
  timestamp: string
}

export interface ChatConversation {
  id: string
  vagaId: string
  vagaTitulo: string
  participantId: string
  participantName: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export interface Avaliacao {
  id: string
  avaliadorId: string
  avaliadoId: string
  vagaId: string
  nota: number
  comentario?: string
  tags: string[]
  criadaEm: string
}

export interface Denuncia {
  id: string
  tipo: "usuario" | "vaga"
  reportadoId: string
  reportadoNome: string
  denuncianteId: string
  motivo: string
  descricao: string
  status: "pendente" | "analisando" | "resolvida" | "descartada"
  criadaEm: string
}
