"use client"

import { useState } from "react"
import {
  ArrowLeft, MapPin, Clock, DollarSign, Users, Calendar,
  Star, Bookmark, Share2, AlertTriangle, Building, User, Send, CheckCircle2,
} from "lucide-react"
import { createCandidatura } from "@/lib/hooks"
import type { Vaga } from "@/lib/types"

interface VagaDetailProps {
  vaga: Vaga
  onBack: () => void
  onCandidatar: (vagaId: string, mensagem: string) => void
}

export function VagaDetail({ vaga, onBack, onCandidatar }: VagaDetailProps) {
  const [showCandidatura, setShowCandidatura] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [enviada, setEnviada] = useState(false)
  const [saved, setSaved] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnviar = async () => {
    setSending(true)
    setError(null)
    const res = await createCandidatura({ vagaId: vaga.id, mensagemInicial: mensagem })
    setSending(false)
    if (res?.id) {
      setEnviada(true)
      onCandidatar(vaga.id, mensagem)
    } else {
      setError(res?.error ?? "Erro ao enviar candidatura")
    }
  }

  // Candidatura confirmation
  if (showCandidatura && !enviada) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
          <button onClick={() => setShowCandidatura(false)} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Confirmar candidatura</h1>
        </header>
        <div className="flex flex-col gap-5 px-4 pt-5 pb-32">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-base font-bold text-foreground">{vaga.titulo}</h3>
            <p className="text-sm text-muted-foreground mt-1">{vaga.contratanteNome}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{vaga.dataInicio}</span>
              <span className="font-bold text-accent">{vaga.valor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">Mensagem inicial (opcional)</label>
            <textarea
              placeholder="Ex: Tenho experiencia na area e estou disponivel neste dia..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={4}
              className="rounded-xl border border-input bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-2 mt-1">
              {["Estou disponivel!", "Tenho experiencia", "Posso comecar no horario"].map((t) => (
                <button
                  key={t}
                  onClick={() => setMensagem(t)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground active:bg-muted"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {Number(vaga.distancia?.replace(/[^0-9.]/g, "") || "0") > 10 && (
            <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Voce esta fora do raio</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A vaga fica a {vaga.distancia} de voce. Deseja candidatar mesmo assim?
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive px-4">{error}</p>
        )}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card px-4 pb-[env(safe-area-inset-bottom)] pt-3">
          <div className="mx-auto max-w-lg pb-3">
            <button
              onClick={handleEnviar}
              disabled={sending}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.97] disabled:opacity-60"
            >
              <Send className="h-5 w-5" />
              {sending ? "Enviando..." : "Enviar candidatura"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Candidatura sent
  if (enviada) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground text-center">Candidatura enviada!</h2>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            O contratante recebera sua candidatura. Acompanhe o status na aba Candidaturas.
          </p>
          <button
            onClick={onBack}
            className="mt-4 flex h-14 w-full max-w-xs items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.97]"
          >
            Voltar ao inicio
          </button>
        </div>
      </div>
    )
  }

  // Vaga Detail View
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setSaved(!saved)} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-muted">
            <Bookmark className={`h-5 w-5 ${saved ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full active:bg-muted">
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-5 px-4 pt-5 pb-32">
        {/* Title section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{vaga.categoria}</span>
            {vaga.urgencia === "alta" && <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">Urgente</span>}
            {vaga.urgencia === "media" && <span className="rounded-md bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning">Hoje</span>}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{vaga.titulo}</h1>
          <span className="text-2xl font-extrabold text-accent">{vaga.valor}</span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground">Local</span>
              <span className="text-sm font-medium text-foreground truncate">{vaga.endereco}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
            <Calendar className="h-5 w-5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Data</span>
              <span className="text-sm font-medium text-foreground">{vaga.dataInicio}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
            <Clock className="h-5 w-5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Horario</span>
              <span className="text-sm font-medium text-foreground">{vaga.horarioInicio} - {vaga.horarioFim}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Vagas</span>
              <span className="text-sm font-medium text-foreground">{vaga.qtdCandidatos}/{vaga.qtdVagas} candidatos</span>
            </div>
          </div>
        </div>

        {/* Distance */}
        {vaga.distancia && (
          <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-foreground">
              {vaga.distancia} de voce
            </span>
          </div>
        )}

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold text-foreground">Descricao</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{vaga.descricao}</p>
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold text-foreground">Requisitos</h3>
          <div className="flex flex-col gap-1.5">
            {vaga.requisitos.map((req) => (
              <div key={req} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contratante */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-bold text-muted-foreground mb-3">Sobre o contratante</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
              {vaga.contratanteTipo === "pj" ? (
                <Building className="h-6 w-6 text-primary" />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-base font-bold text-foreground">{vaga.contratanteNome}</span>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  {vaga.contratanteAvaliacao}
                </span>
                <span>{vaga.contratanteTipo === "pj" ? "Empresa" : "Pessoa Fisica"}</span>
                <span>Ha {vaga.contratanteTempoPlataforma}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card px-4 pb-[env(safe-area-inset-bottom)] pt-3">
        <div className="mx-auto max-w-lg pb-3">
          <button
            onClick={() => setShowCandidatura(true)}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.97]"
          >
            Candidatar-se
          </button>
        </div>
      </div>
    </div>
  )
}
