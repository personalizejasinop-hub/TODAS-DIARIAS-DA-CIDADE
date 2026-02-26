"use client"

import { useState } from "react"
import { Plus, Users, Eye, Pause, Play, ChevronRight } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useVagas } from "@/lib/hooks"
import { VAGA_STATUS_LABELS, VAGA_STATUS_STYLES } from "@/lib/mock-data"
import type { Vaga } from "@/lib/types"

interface MinhasVagasProps {
  onCreateVaga: () => void
  onViewVaga: (vaga: Vaga) => void
}

export function MinhasVagas({ onCreateVaga, onViewVaga }: MinhasVagasProps) {
  const { currentUser } = useAppStore()
  const { vagas, isLoading, error } = useVagas()
  const [filter, setFilter] = useState("todas")
  const filters = ["todas", "publicada", "preenchida", "concluida"]

  const myVagas = vagas
  const filtered = myVagas.filter((v: Vaga) => filter === "todas" ? true : v.status === filter)

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center px-4">
        <p className="text-muted-foreground">Carregando vagas...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">Suas</span>
          <h1 className="text-2xl font-bold text-foreground">Vagas</h1>
        </div>
        <button
          onClick={onCreateVaga}
          className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground active:opacity-80"
        >
          <Plus className="h-4 w-4" />
          Nova
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-primary">{myVagas.filter((v) => v.status === "publicada").length}</span>
          <span className="text-[11px] text-muted-foreground text-center">Abertas</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-accent">{myVagas.reduce((s, v) => s + v.qtdCandidatos, 0)}</span>
          <span className="text-[11px] text-muted-foreground text-center">Candidatos</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-muted-foreground">{myVagas.length}</span>
          <span className="text-[11px] text-muted-foreground text-center">Total</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border"
            }`}
          >
            {f === "todas" ? "Todas" : VAGA_STATUS_LABELS[f] || f}
          </button>
        ))}
      </div>

      {/* Vagas list */}
      <div className="flex flex-col gap-3">
        {filtered.map((vaga: Vaga) => (
          <button
            key={vaga.id}
            onClick={() => onViewVaga(vaga)}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-foreground">{vaga.titulo}</span>
                <span className="text-sm text-muted-foreground">{vaga.categoria}</span>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${VAGA_STATUS_STYLES[vaga.status]}`}>
                {VAGA_STATUS_LABELS[vaga.status]}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {vaga.qtdCandidatos} candidatos
              </span>
              <span className="font-bold text-accent">{vaga.valor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{vaga.dataInicio} | {vaga.horarioInicio}-{vaga.horarioFim}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
