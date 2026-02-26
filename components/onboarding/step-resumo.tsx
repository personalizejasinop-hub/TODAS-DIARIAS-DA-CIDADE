"use client"

import {
  CheckCircle2,
  GraduationCap,
  Bell,
  Briefcase,
  Clock,
  Car,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ESCOLARIDADE_OPTIONS, INTERESSE_OPTIONS, DIAS_SEMANA_OPTIONS, TURNOS_OPTIONS, HORAS_OPTIONS, TRANSPORTE_OPTIONS } from "@/lib/data"

export function StepResumo() {
  const { onboardingData, diariasCategories } = useAppStore()

  const escolaridadeLabel =
    ESCOLARIDADE_OPTIONS.find((o) => o.value === onboardingData.escolaridade)?.label || "Nao informado"
  const interesseLabel =
    INTERESSE_OPTIONS.find((o) => o.value === onboardingData.interesse)?.label || "Nao informado"
  const horasLabel =
    HORAS_OPTIONS.find((o) => o.value === onboardingData.horasPorSemana)?.label || "Nao informado"
  const transporteLabel =
    TRANSPORTE_OPTIONS.find((o) => o.value === onboardingData.transporte)?.label || "Nao informado"

  const allDispOptions = [...DIAS_SEMANA_OPTIONS, ...TURNOS_OPTIONS]
  const disponibilidadeLabels = onboardingData.disponibilidade
    .map((d) => allDispOptions.find((o) => o.value === d)?.label)
    .filter(Boolean)

  const selectedDiarias = diariasCategories.flatMap((cat) =>
    cat.items.filter((item) => onboardingData.diariasSelecionadas.includes(item.id))
  )

  return (
    <div className="flex flex-col gap-5 px-4 pb-32">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
          <CheckCircle2 className="h-7 w-7 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Tudo pronto!
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Confira o resumo do seu cadastro
        </p>
      </div>

      {/* Escolaridade */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Escolaridade</span>
        </div>
        <p className="text-sm text-muted-foreground ml-8">{escolaridadeLabel}</p>
      </div>

      {/* Interesse */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Interesse</span>
        </div>
        <p className="text-sm text-muted-foreground ml-8">{interesseLabel}</p>
        {onboardingData.whatsapp && (
          <p className="text-sm text-accent ml-8 mt-1">
            WhatsApp: {onboardingData.whatsapp}
          </p>
        )}
      </div>

      {/* Diarias */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">
            Diarias selecionadas ({selectedDiarias.length})
          </span>
        </div>
        {selectedDiarias.length > 0 ? (
          <div className="flex flex-wrap gap-2 ml-8">
            {selectedDiarias.slice(0, 8).map((item) => (
              <span
                key={item.id}
                className="inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
              >
                {item.label}
              </span>
            ))}
            {selectedDiarias.length > 8 && (
              <span className="inline-flex rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                +{selectedDiarias.length - 8} mais
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground ml-8">Nenhuma selecionada</p>
        )}
      </div>

      {/* Disponibilidade */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <Clock className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Disponibilidade</span>
        </div>
        <div className="flex flex-col gap-2 ml-8">
          {disponibilidadeLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {disponibilidadeLabels.map((label) => (
                <span
                  key={label}
                  className="inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nao informado</p>
          )}
          <p className="text-sm text-muted-foreground">
            Horas/semana: <span className="font-medium text-foreground">{horasLabel}</span>
          </p>
        </div>
      </div>

      {/* Transporte */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <Car className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Transporte</span>
        </div>
        <p className="text-sm text-muted-foreground ml-8">{transporteLabel}</p>
      </div>
    </div>
  )
}
