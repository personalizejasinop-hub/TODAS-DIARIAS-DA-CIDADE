"use client"

import { useState } from "react"
import { MapPin, Clock, MessageCircle, X as XIcon } from "lucide-react"
import { useCandidaturas } from "@/lib/hooks"
import { CANDIDATURA_STATUS_LABELS, CANDIDATURA_STATUS_STYLES } from "@/lib/mock-data"

interface CandidaturasProps {
  onOpenChat: (vagaId: string, participantName: string, opts?: { vagaTitulo?: string; receiverId?: string }) => void
}

export function Candidaturas({ onOpenChat }: CandidaturasProps) {
  const [filter, setFilter] = useState("todas")
  const { candidaturas, isLoading, error } = useCandidaturas()

  const filters = ["todas", "enviada", "em_analise", "selecionado", "convidado", "recusado"]

  const filtered = candidaturas.filter((c: { status: string }) =>
    filter === "todas" ? true : c.status === filter
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center px-4">
        <p className="text-muted-foreground">Carregando candidaturas...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">Minhas</span>
        <h1 className="text-2xl font-bold text-foreground">Candidaturas</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-accent">
            {candidaturas.filter((c: { status: string }) => c.status === "selecionado").length}
          </span>
          <span className="text-[11px] text-muted-foreground text-center">Selecionado</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-warning">
            {candidaturas.filter((c: { status: string }) => c.status === "em_analise" || c.status === "enviada").length}
          </span>
          <span className="text-[11px] text-muted-foreground text-center">Em analise</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-muted-foreground">{candidaturas.length}</span>
          <span className="text-[11px] text-muted-foreground text-center">Total</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            {f === "todas" ? "Todas" : CANDIDATURA_STATUS_LABELS[f] || f}
          </button>
        ))}
      </div>

      {/* Candidaturas list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhuma candidatura neste filtro</p>
          </div>
        ) : (
          filtered.map((cand: { id: string; vagaId: string; vagaTitulo: string; contratanteNome: string; contratanteId: string; vagaLocal: string; vagaData: string; vagaValor: string; status: string }) => (
            <div key={cand.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-bold text-foreground">{cand.vagaTitulo}</span>
                  <span className="text-sm text-muted-foreground">{cand.contratanteNome}</span>
                </div>
                <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${CANDIDATURA_STATUS_STYLES[cand.status]}`}>
                  {CANDIDATURA_STATUS_LABELS[cand.status]}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {cand.vagaLocal}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {cand.vagaData}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-accent">{cand.vagaValor}</span>
                <div className="flex items-center gap-2">
                  {(cand.status === "selecionado" || cand.status === "em_analise" || cand.status === "convidado") && (
                    <button
                      onClick={() => onOpenChat(cand.vagaId, cand.contratanteNome, { vagaTitulo: cand.vagaTitulo, receiverId: cand.contratanteId })}
                      className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary active:bg-primary/20"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat
                    </button>
                  )}
                  {cand.status === "enviada" && (
                    <button className="flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive active:bg-destructive/20">
                      <XIcon className="h-3.5 w-3.5" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
