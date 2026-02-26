"use client"

import {
  User,
  GraduationCap,
  Bell,
  Briefcase,
  Clock,
  Car,
  ChevronRight,
  LogOut,
  Edit3,
  ArrowLeftRight,
  Zap,
  Star,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import {
  ESCOLARIDADE_OPTIONS,
  INTERESSE_OPTIONS,
  DISPONIBILIDADE_OPTIONS,
  HORAS_OPTIONS,
  TRANSPORTE_OPTIONS,
} from "@/lib/data"

interface ProfileSectionProps {
  icon: React.ReactNode
  title: string
  value: string
  onEdit?: () => void
}

function ProfileSection({ icon, title, value, onEdit }: ProfileSectionProps) {
  return (
    <button
      onClick={onEdit}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="text-xs font-semibold text-muted-foreground">{title}</span>
        <span className="text-sm font-medium text-foreground truncate">{value}</span>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  )
}

export function CandidateProfile() {
  const { currentUser, logout, switchMode } = useAppStore()

  if (!currentUser) return null

  const escolaridadeLabel =
    ESCOLARIDADE_OPTIONS.find((o) => o.value === currentUser.escolaridade)?.label || "Nao informado"
  const interesseLabel =
    INTERESSE_OPTIONS.find((o) => o.value === currentUser.interesse)?.label || "Nao informado"
  const horasLabel =
    HORAS_OPTIONS.find((o) => o.value === currentUser.horasPorSemana)?.label || "Nao informado"
  const transporteLabel =
    TRANSPORTE_OPTIONS.find((o) => o.value === currentUser.transporte)?.label || "Nao informado"
  const disponibilidadeLabels = currentUser.disponibilidade
    .map((d) => DISPONIBILIDADE_OPTIONS.find((o) => o.value === d)?.label)
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-4 pb-24 px-4">
      {/* Avatar card */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
          <span className="text-sm text-muted-foreground">{currentUser.email}</span>
          {currentUser.whatsapp && (
            <span className="text-sm text-accent font-medium">
              WhatsApp: {currentUser.whatsapp}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-bold text-accent">Perfil completo</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
            <Zap className="h-3 w-3 text-primary" />
            <span className="text-xs font-bold text-primary">Score 95%</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="text-sm font-bold text-foreground">4.8</span>
          <span className="text-xs text-muted-foreground">(12 avaliacoes)</span>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
          Meu Cadastro
        </h3>

        <ProfileSection
          icon={<GraduationCap className="h-5 w-5 text-primary" />}
          title="Escolaridade"
          value={escolaridadeLabel}
        />

        <ProfileSection
          icon={<Bell className="h-5 w-5 text-primary" />}
          title="Interesse"
          value={interesseLabel}
        />

        <ProfileSection
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          title="Diarias selecionadas"
          value={`${currentUser.diariasSelecionadas.length} habilidades`}
        />

        <ProfileSection
          icon={<Clock className="h-5 w-5 text-primary" />}
          title="Disponibilidade"
          value={disponibilidadeLabels.length > 0 ? disponibilidadeLabels.join(", ") : "Nao informado"}
        />

        <ProfileSection
          icon={<Clock className="h-5 w-5 text-primary" />}
          title="Horas por semana"
          value={horasLabel}
        />

        <ProfileSection
          icon={<Car className="h-5 w-5 text-primary" />}
          title="Transporte"
          value={transporteLabel}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={switchMode}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-warning text-base font-bold text-warning-foreground transition-all active:scale-[0.97]"
        >
          <ArrowLeftRight className="h-5 w-5" />
          Mudar para Contratante
        </button>
        <button
          onClick={() => {}}
          className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 text-base font-bold text-primary transition-all active:scale-[0.97]"
        >
          <Edit3 className="h-5 w-5" />
          Editar Cadastro
        </button>
        <button
          onClick={logout}
          className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-destructive/20 text-base font-bold text-destructive transition-all active:scale-[0.97]"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
}
