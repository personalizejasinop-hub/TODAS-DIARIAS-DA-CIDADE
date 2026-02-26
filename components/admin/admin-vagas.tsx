"use client"

import { useState } from "react"
import { Search, Eye, Pause, X, Briefcase } from "lucide-react"
import { MOCK_VAGAS, VAGA_STATUS_LABELS, VAGA_STATUS_STYLES } from "@/lib/mock-data"

export function AdminVagas() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("todas")

  const filters = ["todas", "publicada", "pausada", "concluida", "cancelada"]
  const filtered = MOCK_VAGAS.filter((v) => {
    const matchSearch = v.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || v.contratanteNome.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter = filter === "todas" || v.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">Gerenciar</span>
          <h1 className="text-2xl font-bold text-foreground">Vagas</h1>
        </div>
        <div className="flex h-10 items-center gap-1 rounded-xl border border-border bg-card px-3">
          <Briefcase className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{MOCK_VAGAS.length}</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar vaga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

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

      <div className="flex flex-col gap-2">
        {filtered.map((vaga) => (
          <div key={vaga.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-foreground">{vaga.titulo}</span>
                <span className="text-xs text-muted-foreground">{vaga.contratanteNome}</span>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${VAGA_STATUS_STYLES[vaga.status]}`}>
                {VAGA_STATUS_LABELS[vaga.status]}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span>{vaga.qtdCandidatos} candidatos</span>
              <span>{vaga.valor}</span>
              <span>{vaga.dataInicio}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary active:bg-primary/20">
                <Eye className="h-3 w-3" />
                Ver
              </button>
              <button className="flex items-center gap-1 rounded-lg bg-warning/10 px-3 py-1.5 text-xs font-bold text-warning active:bg-warning/20">
                <Pause className="h-3 w-3" />
                Pausar
              </button>
              <button className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive active:bg-destructive/20">
                <X className="h-3 w-3" />
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
