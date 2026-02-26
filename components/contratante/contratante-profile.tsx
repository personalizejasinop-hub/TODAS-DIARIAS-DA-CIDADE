"use client"

import {
  Building, User, MapPin, Star, Shield, Edit3, LogOut, ArrowLeftRight, Zap,
} from "lucide-react"
import { useAppStore } from "@/lib/store"

interface ContratanteProfileProps {
  onSwitchMode: () => void
}

export function ContratanteProfile({ onSwitchMode }: ContratanteProfileProps) {
  const { currentUser, logout } = useAppStore()
  if (!currentUser) return null

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      {/* Avatar card */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
          <Building className="h-10 w-10 text-warning" />
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <h2 className="text-xl font-bold text-foreground">
            {currentUser.contratanteTipo === "pj" && currentUser.empresa ? currentUser.empresa : currentUser.name}
          </h2>
          <span className="text-sm text-muted-foreground">{currentUser.email}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            4.7
          </span>
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-accent" />
            Verificado
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-primary">12</span>
          <span className="text-[11px] text-muted-foreground text-center">Vagas criadas</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-accent">47</span>
          <span className="text-[11px] text-muted-foreground text-center">Contratacoes</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-3">
          <span className="text-xl font-bold text-warning">4.7</span>
          <span className="text-[11px] text-muted-foreground text-center">Avaliacao</span>
        </div>
      </div>

      {/* Info sections */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Meu Perfil</h3>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Tipo</span>
            <span className="text-sm font-medium text-foreground">
            {currentUser.contratanteTipo === "pj" ? "Pessoa Juridica (PJ)" : "Pessoa Fisica (PF)"}
          </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Endereco</span>
            <span className="text-sm font-medium text-foreground">Centro, Fortaleza - CE</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Raio de busca</span>
            <span className="text-sm font-medium text-foreground">25 km</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={onSwitchMode}
          className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 text-base font-bold text-primary transition-all active:scale-[0.97]"
        >
          <ArrowLeftRight className="h-5 w-5" />
          Mudar para Candidato
        </button>
        <button
          className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-border text-base font-bold text-foreground transition-all active:scale-[0.97]"
        >
          <Edit3 className="h-5 w-5" />
          Editar Perfil
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
