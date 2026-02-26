"use client"

import { useState } from "react"
import { ArrowLeft, Check, X, MessageCircle, Star, MapPin, Zap } from "lucide-react"
import { useCandidaturas } from "@/lib/hooks"
import type { Vaga } from "@/lib/types"

interface GestaoCandidatosProps {
  vaga: Vaga
  onBack: () => void
  onOpenChat: (vagaId: string, participantName: string, opts?: { vagaTitulo?: string; receiverId?: string }) => void
}

export function GestaoCandidatos({ vaga, onBack, onOpenChat }: GestaoCandidatosProps) {
  const { candidaturas, isLoading } = useCandidaturas(vaga.id)
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [rejected, setRejected] = useState<Set<string>>(new Set())

  const candidatos = candidaturas.map((c: Record<string, unknown>) => ({
    id: c.candidatoId as string,
    nome: (c.candidatoNome as string) || "Candidato",
    especialidades: [],
    avaliacaoMedia: 0,
    scoreAgilidade: 0,
    distancia: "",
  }))
  const handleAccept = (id: string) => {
    setAccepted((prev) => new Set([...prev, id]))
    setRejected((prev) => { const n = new Set(prev); n.delete(id); return n })
  }
  const handleReject = (id: string) => {
    setRejected((prev) => new Set([...prev, id]))
    setAccepted((prev) => { const n = new Set(prev); n.delete(id); return n })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-foreground">Candidatos</h1>
          <span className="text-xs text-muted-foreground">{vaga.titulo}</span>
        </div>
      </header>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center px-4">
          <p className="text-muted-foreground">Carregando candidatos...</p>
        </div>
      ) : (
      <div className="flex flex-col gap-3 px-4 pt-4 pb-24">
        {/* Summary */}
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-card p-3">
            <span className="text-lg font-bold text-primary">{candidatos.length}</span>
            <span className="text-[11px] text-muted-foreground">Total</span>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-card p-3">
            <span className="text-lg font-bold text-accent">{accepted.size}</span>
            <span className="text-[11px] text-muted-foreground">Aceitos</span>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-card p-3">
            <span className="text-lg font-bold text-destructive">{rejected.size}</span>
            <span className="text-[11px] text-muted-foreground">Recusados</span>
          </div>
        </div>

        {candidatos.map((cand) => {
          const isAccepted = accepted.has(cand.id)
          const isRejected = rejected.has(cand.id)

          return (
            <div
              key={cand.id}
              className={`rounded-2xl border bg-card p-4 transition-all ${
                isAccepted ? "border-accent/40" : isRejected ? "border-destructive/20 opacity-60" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{cand.nome.charAt(0)}</span>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-foreground">{cand.nome}</span>
                    {isAccepted && <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">Aceito</span>}
                    {isRejected && <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">Recusado</span>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cand.especialidades.map((e) => (
                      <span key={e} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{e}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {cand.avaliacaoMedia}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-accent" />
                      {cand.scoreAgilidade}%
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {cand.distancia}
                    </span>
                  </div>
                </div>
              </div>

              {!isRejected && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(cand.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold active:scale-[0.97] ${
                      isAccepted
                        ? "bg-accent text-accent-foreground"
                        : "border-2 border-accent text-accent"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    {isAccepted ? "Aceito" : "Aceitar"}
                  </button>
                  <button
                    onClick={() => handleReject(cand.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-border py-2.5 text-sm font-bold text-muted-foreground active:scale-[0.97]"
                  >
                    <X className="h-4 w-4" />
                    Recusar
                  </button>
                  <button
                    onClick={() => onOpenChat(vaga.id, cand.nome, { vagaTitulo: vaga.titulo, receiverId: cand.id })}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-primary/30 text-primary active:bg-primary/10"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
