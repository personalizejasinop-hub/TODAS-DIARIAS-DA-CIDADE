"use client"

import { useState } from "react"
import {
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Search,
  Briefcase,
  Star,
  Filter,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useVagas } from "@/lib/hooks"
import type { Vaga } from "@/lib/types"

function UrgencyBadge({ urgency }: { urgency: string }) {
  const styles: Record<string, string> = {
    alta: "bg-destructive/10 text-destructive",
    media: "bg-warning/10 text-warning",
    normal: "bg-muted text-muted-foreground",
  }
  const labels: Record<string, string> = {
    alta: "Urgente",
    media: "Hoje",
    normal: "Esta semana",
  }
  const key = urgency && styles[urgency] ? urgency : "normal"
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${styles[key]}`}>
      {labels[key]}
    </span>
  )
}

function formatPostedAgo(createdAt: string): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (Number.isNaN(diffMs) || diffMs < 0) return ""
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60) return `${diffMins} min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return "Semana"
}

interface CandidateHomeProps {
  onOpenVaga?: (vaga: Vaga) => void
}

export function CandidateHome({ onOpenVaga }: CandidateHomeProps) {
  const { currentUser } = useAppStore()
  const { vagas, isLoading, error } = useVagas()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("todas")

  const firstName = currentUser?.name?.split(" ")[0] || "Candidato"

  const filters = ["todas", ...new Set(vagas.map((v: Vaga) => v.categoria).filter((c): c is string => Boolean(c)))]

  const filtered = vagas.filter((v: Vaga) => {
    const matchSearch =
      v.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contratanteNome?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter = selectedFilter === "todas" || v.categoria === selectedFilter
    return matchSearch && matchFilter
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center px-4">
        <p className="text-muted-foreground">Carregando vagas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center px-4">
        <p className="text-destructive">Erro ao carregar vagas. Tente novamente.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Greeting header */}
      <div className="flex flex-col gap-1 px-4 pt-2">
        <span className="text-sm text-muted-foreground">Ola,</span>
        <h1 className="text-2xl font-bold text-foreground">{firstName}</h1>
      </div>

      {/* Stats strip */}
      <div className="flex gap-3 overflow-x-auto px-4 scrollbar-none">
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {currentUser?.diariasSelecionadas?.length || 0}
            </span>
            <span className="text-[11px] text-muted-foreground">Habilidades</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <Star className="h-5 w-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">{vagas.length}</span>
            <span className="text-[11px] text-muted-foreground">Oportunidades</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {currentUser?.raioBusca ?? 10}km
            </span>
            <span className="text-[11px] text-muted-foreground">Raio</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar oportunidade..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Buscar oportunidade"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10" aria-label="Filtrar">
            <Filter className="h-4 w-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-4 scrollbar-none">
        {filters.slice(0, 8).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            aria-pressed={selectedFilter === filter}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              selectedFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            {filter === "todas" ? "Todas" : filter}
          </button>
        ))}
      </div>

      {/* Opportunities list */}
      <div className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Oportunidades perto de voce
          </h2>
          <span className="text-sm text-muted-foreground">{filtered.length} vagas</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Nenhuma vaga encontrada
          </div>
        ) : (
          filtered.map((vaga: Vaga) => (
            <button
              key={String(vaga.id)}
              type="button"
              onClick={() => onOpenVaga?.(vaga)}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98] active:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-base font-bold text-foreground leading-snug">
                    {vaga.titulo}
                  </span>
                  <span className="text-sm text-muted-foreground">{vaga.contratanteNome}</span>
                </div>
                <UrgencyBadge urgency={vaga.urgencia || "normal"} />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {vaga.distancia || `${vaga.cidade || ""}`}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatPostedAgo(vaga.criadaEm || "")}
                </span>
                <span className="flex items-center gap-1 font-bold text-accent">
                  <DollarSign className="h-3.5 w-3.5" />
                  {vaga.valor}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {[vaga.categoria, ...(vaga.habilidades || [])]
                    .filter((t): t is string => Boolean(t))
                    .slice(0, 3)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
