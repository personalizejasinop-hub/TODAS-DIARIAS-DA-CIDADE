import type { DiariasCategory } from "./types"

export const ESCOLARIDADE_OPTIONS = [
  { value: "fundamental_incompleto", label: "Fundamental incompleto" },
  { value: "fundamental_completo", label: "Fundamental completo" },
  { value: "medio_incompleto", label: "Medio incompleto" },
  { value: "medio_completo", label: "Medio completo" },
  { value: "tecnico", label: "Tecnico" },
  { value: "superior_incompleto", label: "Superior incompleto" },
  { value: "superior_completo", label: "Superior completo" },
] as const

export const INTERESSE_OPTIONS = [
  { value: "sim_whatsapp", label: "Sim, quero receber pelo WhatsApp" },
  { value: "sim_fds", label: "Sim, mas so finais de semana" },
  { value: "sim_semana", label: "Sim, mas so durante a semana" },
  { value: "talvez", label: "Talvez (quero entender melhor)" },
  { value: "nao", label: "Nao tenho interesse" },
] as const

export const DIAS_SEMANA_OPTIONS = [
  { value: "segunda", label: "Seg" },
  { value: "terca", label: "Ter" },
  { value: "quarta", label: "Qua" },
  { value: "quinta", label: "Qui" },
  { value: "sexta", label: "Sex" },
  { value: "sabado", label: "Sab" },
  { value: "domingo", label: "Dom" },
] as const

export const TURNOS_OPTIONS = [
  { value: "manha", label: "Manha" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
] as const

// Keep for backward compat
export const DISPONIBILIDADE_OPTIONS = [
  ...DIAS_SEMANA_OPTIONS,
  ...TURNOS_OPTIONS,
] as const

export const HORAS_OPTIONS = [
  { value: "2h", label: "2h" },
  { value: "4h", label: "4h" },
  { value: "6h", label: "6h" },
  { value: "8h+", label: "8h+" },
] as const

export const TRANSPORTE_OPTIONS = [
  { value: "nao", label: "Nao tenho" },
  { value: "bicicleta", label: "Bicicleta" },
  { value: "moto", label: "Moto" },
  { value: "carro", label: "Carro" },
] as const

export const DIARIAS_CATEGORIES: DiariasCategory[] = [
  {
    id: "casa-rotina",
    name: "Casa e Rotina",
    icon: "home",
    items: [
      { id: "passar-roupa", label: "Passar roupa", active: true },
      { id: "limpeza-casa", label: "Limpeza de casa / limpeza pos-evento", active: true },
    ],
  },
  {
    id: "comida-producao",
    name: "Comida e Producao",
    icon: "cooking",
    items: [
      { id: "marmita-bolo", label: "Marmita / bolo no pote / doces", active: true },
    ],
  },
  {
    id: "eventos-atendimento",
    name: "Eventos e Atendimento",
    icon: "celebration",
    items: [
      { id: "ajudante-eventos", label: "Ajudante de eventos (montagem, apoio, limpeza)", active: true },
      { id: "garcom-copeiro", label: "Garcom / copeiro / auxiliar de cozinha", active: true },
      { id: "plantao-fds", label: "Plantao fim de semana (loja, feira, apoio, portaria)", active: true },
      { id: "atendimento-recepcao", label: "Atendimento / recepcao / balcao", active: true },
    ],
  },
  {
    id: "comercial-divulgacao",
    name: "Comercial e Divulgacao",
    icon: "campaign",
    items: [
      { id: "vendas-comissao", label: "Vendas por comissao", active: true },
      { id: "indicacoes", label: "Indicacoes (trazer interessados / clientes)", active: true },
      { id: "captacao-interessados", label: "Captacao de interessados (divulgacao no bairro/whats)", active: true },
      { id: "pesquisas", label: "Preenchimento de pesquisas (rua/telefone/online)", active: true },
      { id: "panfletagem", label: "Panfletagem / abordagem em porta de loja", active: true },
    ],
  },
  {
    id: "fretes-logistica",
    name: "Fretes e Logistica",
    icon: "local_shipping",
    items: [
      { id: "frete-carro-moto", label: "Frete com carro/moto", active: true },
      { id: "mudanca-carregador", label: "Mudanca / carregador / ajudante de frete", active: true },
      { id: "entregas-delivery", label: "Entregas (delivery/bike/moto)", active: true },
      { id: "motoboy-turno", label: "Motoboy/entregador por turno", active: true },
      { id: "auxiliar-estoque", label: "Auxiliar de estoque / separacao / embalagem", active: true },
    ],
  },
  {
    id: "terreno-jardim",
    name: "Terreno, Jardim e Externo",
    icon: "park",
    items: [
      { id: "limpeza-terreno", label: "Limpeza de terreno / quintal", active: true },
      { id: "jardineiro-rocagem", label: "Jardineiro / rocagem", active: true },
    ],
  },
  {
    id: "obras-reparos",
    name: "Obras e Reparos",
    icon: "construction",
    items: [
      { id: "servicos-gerais", label: "Servicos gerais (pequenos reparos, pintura simples)", active: true },
      { id: "pedreiro-ajudante", label: "Pedreiro / ajudante de pedreiro", active: true },
      { id: "pintor", label: "Pintor", active: true },
      { id: "instalador-basico", label: "Instalador basico (suporte TV, prateleira, cortina)", active: true },
    ],
  },
  {
    id: "tecnico-informatica",
    name: "Tecnico e Informatica",
    icon: "computer",
    items: [
      { id: "manutencao-celular-pc", label: "Manutencao basica (celular/PC)", active: true },
      { id: "digitacao-planilha", label: "Digitacao / planilha / emissao de boletos (se sabe)", active: true },
    ],
  },
  {
    id: "cuidados",
    name: "Cuidados",
    icon: "favorite",
    items: [
      { id: "baba-crianca", label: "Cuidar de crianca (baba)", active: true },
      { id: "cuidar-idoso", label: "Cuidar de idoso / acompanhante", active: true },
    ],
  },
  {
    id: "servicos-pessoais",
    name: "Servicos Pessoais",
    icon: "content_cut",
    items: [
      { id: "cabeleireiro-barbeiro", label: "Cabeleireiro/barbeiro/manicure (se ja faz)", active: true },
      { id: "costura-ajustes", label: "Costura / ajustes de roupa", active: true },
    ],
  },
  {
    id: "pets",
    name: "Pets",
    icon: "pets",
    items: [
      { id: "cuidador-pets", label: "Cuidador de pets (passear / cuidar fim de semana)", active: true },
    ],
  },
  {
    id: "conteudo-midia",
    name: "Conteudo e Midia Local",
    icon: "videocam",
    items: [
      { id: "producao-conteudo", label: "Producao de conteudo simples (gravar videos pra loja/bairro)", active: true },
      { id: "fotografia-video", label: "Fotografia/video simples com celular pra comercio local", active: true },
    ],
  },
  {
    id: "automotivo",
    name: "Automotivo",
    icon: "directions_car",
    items: [
      { id: "lavador-carros", label: "Lavador de carros (em casa ou lava-jato)", active: true },
    ],
  },
  {
    id: "outros",
    name: "Outros",
    icon: "more_horiz",
    items: [],
  },
]

export function getAllDiariasItems() {
  return DIARIAS_CATEGORIES.flatMap((cat) =>
    cat.items.filter((item) => item.active).map((item) => ({
      ...item,
      categoryId: cat.id,
      categoryName: cat.name,
    }))
  )
}

export function getDiariasCountByCategory(selectedIds: string[]) {
  return DIARIAS_CATEGORIES.map((cat) => ({
    ...cat,
    selectedCount: cat.items.filter((item) => selectedIds.includes(item.id)).length,
    totalCount: cat.items.filter((item) => item.active).length,
  }))
}
