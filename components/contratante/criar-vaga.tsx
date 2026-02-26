"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react"
import { DIARIAS_CATEGORIES } from "@/lib/data"
import { createVaga } from "@/lib/hooks"

interface CriarVagaProps {
  onBack: () => void
  onCreated: () => void
}

export function CriarVaga({ onBack, onCreated }: CriarVagaProps) {
  const [step, setStep] = useState(1)
  const [titulo, setTitulo] = useState("")
  const [categoria, setCategoria] = useState("")
  const [descricao, setDescricao] = useState("")
  const [endereco, setEndereco] = useState("")
  const [cep, setCep] = useState("")
  const [cidade, setCidade] = useState("Fortaleza")
  const [dataInicio, setDataInicio] = useState("")
  const [horarioInicio, setHorarioInicio] = useState("")
  const [horarioFim, setHorarioFim] = useState("")
  const [valor, setValor] = useState("")
  const [qtdVagas, setQtdVagas] = useState("1")
  const [requisitos, setRequisitos] = useState("")
  const [tipo, setTipo] = useState<"presencial" | "home_office">("presencial")
  const [outraCategoria, setOutraCategoria] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 3

  const canAdvance = () => {
    if (step === 1) return titulo && (categoria && (categoria !== "outras" || outraCategoria.trim()))
    if (step === 2) return (tipo === "home_office" || endereco) && dataInicio && horarioInicio && horarioFim
    if (step === 3) return valor && qtdVagas
    return false
  }

  const handlePublish = async () => {
    setSending(true)
    setError(null)
    const cat = categoria === "outras" ? outraCategoria.trim() : categoria
    const reqList = requisitos.trim() ? requisitos.trim().split(/\r?\n/).filter(Boolean) : []
    const res = await createVaga({
      titulo,
      categoria: cat,
      descricao,
      requisitos: reqList,
      valor,
      qtdVagas: parseInt(qtdVagas, 10) || 1,
      tipo,
      endereco,
      cidade,
      cep,
      dataInicio: dataInicio,
      dataFim: dataInicio,
      horarioInicio,
      horarioFim,
    })
    setSending(false)
    if (res?.id) {
      onCreated()
    } else {
      setError(res?.error ?? "Erro ao publicar vaga")
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-primary">Passo {step} de {totalSteps}</span>
            <span className="text-xs text-muted-foreground">
              {step === 1 ? "Basico" : step === 2 ? "Local e horario" : "Pagamento e requisitos"}
            </span>
          </div>
          <div className="h-10 w-10" />
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-32">
        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">Informacoes basicas</h2>
              <p className="text-sm text-muted-foreground">Descreva a vaga que voce quer publicar</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Titulo da vaga</label>
              <input
                type="text"
                placeholder="Ex: Ajudante de evento"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Categoria</label>
              <div className="grid grid-cols-2 gap-2">
                {DIARIAS_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoria(cat.id)}
                    className={`rounded-xl border p-3 text-left text-sm font-medium transition-all active:scale-[0.97] ${
                      categoria === cat.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => setCategoria("outras")}
                  className={`rounded-xl border p-3 text-left text-sm font-medium transition-all active:scale-[0.97] ${
                    categoria === "outras"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  Outras
                </button>
              </div>
              {categoria === "outras" && (
                <div className="flex flex-col gap-2 mt-1">
                  <label className="text-sm font-bold text-foreground">Nome da categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Servico de costura"
                    value={outraCategoria}
                    onChange={(e) => setOutraCategoria(e.target.value)}
                    className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    O nome que voce digitar ficara visivel para os candidatos e aparecera no painel do admin.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Descricao</label>
              <textarea
                placeholder="Descreva o que o candidato ira fazer..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="rounded-xl border border-input bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location and time */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">Local e horario</h2>
              <p className="text-sm text-muted-foreground">Onde e quando sera o servico</p>
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Modalidade</label>
              <div className="flex gap-3">
                {(["presencial", "home_office"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                      tipo === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                    }`}
                  >
                    {t === "presencial" ? "Presencial" : "Home Office"}
                  </button>
                ))}
              </div>
            </div>

            {tipo === "presencial" && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">CEP</label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Endereco completo</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rua, numero, bairro"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </>
            )}

            {tipo === "home_office" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Cidade base</label>
                <input
                  type="text"
                  placeholder="Ex: Fortaleza"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Data de inicio</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Inicio</label>
                <input
                  type="time"
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-bold text-foreground">Fim</label>
                <input
                  type="time"
                  value={horarioFim}
                  onChange={(e) => setHorarioFim(e.target.value)}
                  className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment and requirements */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-foreground">Pagamento e requisitos</h2>
              <p className="text-sm text-muted-foreground">Defina o valor e o que espera do candidato</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Valor por dia</label>
              <input
                type="text"
                placeholder="Ex: R$ 120"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Quantidade de vagas</label>
              <div className="flex gap-3">
                {["1", "2", "3", "5", "10"].map((n) => (
                  <button
                    key={n}
                    onClick={() => setQtdVagas(n)}
                    className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                      qtdVagas === n ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Requisitos (um por linha)</label>
              <textarea
                placeholder={"Pontualidade\nBoa comunicacao\nExperiencia anterior"}
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
                rows={4}
                className="rounded-xl border border-input bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        )}
      </main>

      {error && (
        <p className="text-sm text-destructive px-4">{error}</p>
      )}
      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card px-4 pb-[env(safe-area-inset-bottom)] pt-3">
        <div className="mx-auto flex max-w-lg gap-3 pb-3">
          <button
            onClick={() => {
              if (step < totalSteps) setStep(step + 1)
              else handlePublish()
            }}
            disabled={!canAdvance() || sending}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground transition-all active:scale-[0.97] disabled:opacity-40"
          >
            {step === totalSteps ? (
              <>
                <Check className="h-5 w-5" />
                {sending ? "Publicando..." : "Publicar vaga"}
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
