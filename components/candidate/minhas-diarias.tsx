"use client"

import { Briefcase, Check, MapPin, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface AppliedJob {
  id: string
  title: string
  company: string
  location: string
  date: string
  status: "confirmado" | "aguardando" | "finalizado"
  pay: string
}

const MOCK_APPLIED: AppliedJob[] = [
  {
    id: "1",
    title: "Ajudante de Evento",
    company: "Buffet Sabor & Arte",
    location: "Centro, Fortaleza",
    date: "Sab, 15/02",
    status: "confirmado",
    pay: "R$ 120",
  },
  {
    id: "2",
    title: "Garcom para Casamento",
    company: "Espaco Celebrar",
    location: "Messejana, Fortaleza",
    date: "Dom, 16/02",
    status: "aguardando",
    pay: "R$ 180",
  },
  {
    id: "3",
    title: "Limpeza de Escritorio",
    company: "Office Clean",
    location: "Aldeota, Fortaleza",
    date: "Sex, 07/02",
    status: "finalizado",
    pay: "R$ 100",
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmado: "bg-accent/10 text-accent",
    aguardando: "bg-warning/10 text-warning",
    finalizado: "bg-muted text-muted-foreground",
  }
  const labels: Record<string, string> = {
    confirmado: "Confirmado",
    aguardando: "Aguardando",
    finalizado: "Finalizado",
  }
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function MinhasDiarias() {
  const { currentUser } = useAppStore()

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">Minhas</span>
        <h1 className="text-2xl font-bold text-foreground">Diarias</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-primary">
            {MOCK_APPLIED.filter((j) => j.status === "confirmado").length}
          </span>
          <span className="text-[11px] text-muted-foreground text-center">Confirmadas</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-warning">
            {MOCK_APPLIED.filter((j) => j.status === "aguardando").length}
          </span>
          <span className="text-[11px] text-muted-foreground text-center">Aguardando</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-muted-foreground">
            {MOCK_APPLIED.filter((j) => j.status === "finalizado").length}
          </span>
          <span className="text-[11px] text-muted-foreground text-center">Finalizadas</span>
        </div>
      </div>

      {/* My skills summary */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Minhas Habilidades</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(currentUser?.diariasSelecionadas || []).length > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">
                Voce marcou {currentUser?.diariasSelecionadas.length} habilidades no seu perfil.
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              Complete seu cadastro para ver suas habilidades aqui.
            </span>
          )}
        </div>
      </div>

      {/* Applied jobs */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-foreground">Historico</h2>
        {MOCK_APPLIED.map((job) => (
          <div
            key={job.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-foreground">{job.title}</span>
                <span className="text-sm text-muted-foreground">{job.company}</span>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {job.date}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-accent">{job.pay}</span>
              {job.status === "confirmado" && (
                <div className="flex items-center gap-1 text-accent">
                  <Check className="h-4 w-4" />
                  <span className="text-xs font-bold">Vaga garantida</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
