"use client"

import { useState } from "react"
import { AlertTriangle, Shield, Ban, CheckCircle2, X, User, Briefcase } from "lucide-react"
import { MOCK_DENUNCIAS } from "@/lib/mock-data"

const STATUS_STYLES: Record<string, string> = {
  pendente: "bg-destructive/10 text-destructive",
  analisando: "bg-warning/10 text-warning",
  resolvida: "bg-accent/10 text-accent",
  descartada: "bg-muted text-muted-foreground",
}

const STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  analisando: "Analisando",
  resolvida: "Resolvida",
  descartada: "Descartada",
}

export function AdminDenuncias() {
  const [filter, setFilter] = useState("todas")
  const filters = ["todas", "pendente", "analisando", "resolvida"]

  const filtered = MOCK_DENUNCIAS.filter((d) => filter === "todas" || d.status === filter)

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">Moderacao</span>
          <h1 className="text-2xl font-bold text-foreground">Denuncias</h1>
        </div>
        <div className="flex h-10 items-center gap-1 rounded-xl border border-destructive/30 bg-destructive/5 px-3">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm font-bold text-destructive">
            {MOCK_DENUNCIAS.filter((d) => d.status === "pendente").length}
          </span>
        </div>
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
            {f === "todas" ? "Todas" : STATUS_LABELS[f] || f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((den) => (
          <div key={den.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  den.tipo === "usuario" ? "bg-primary/10" : "bg-warning/10"
                }`}>
                  {den.tipo === "usuario" ? (
                    <User className="h-4 w-4 text-primary" />
                  ) : (
                    <Briefcase className="h-4 w-4 text-warning" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">{den.reportadoNome}</span>
                  <span className="text-xs text-muted-foreground">{den.tipo === "usuario" ? "Usuario" : "Vaga"}</span>
                </div>
              </div>
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[den.status]}`}>
                {STATUS_LABELS[den.status]}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 mb-3">
              <span className="text-xs font-bold text-destructive">{den.motivo}</span>
              <p className="text-sm text-muted-foreground">{den.descricao}</p>
            </div>

            {den.status === "pendente" && (
              <div className="flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-warning/10 py-2.5 text-xs font-bold text-warning active:bg-warning/20">
                  <Shield className="h-3.5 w-3.5" />
                  Advertir
                </button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-2.5 text-xs font-bold text-destructive active:bg-destructive/20">
                  <Ban className="h-3.5 w-3.5" />
                  Bloquear
                </button>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-muted py-2.5 text-xs font-bold text-muted-foreground active:bg-muted/80">
                  <X className="h-3.5 w-3.5" />
                  Descartar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
