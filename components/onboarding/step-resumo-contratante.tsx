"use client"

import { CheckCircle2, Building, Briefcase } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function StepResumoContratante() {
  const { currentUser, onboardingData, diariasCategories } = useAppStore()

  const tipoLabel = currentUser?.contratanteTipo === "pf" ? "Pessoa Fisica" : "Pessoa Juridica"

  const selectedAreas = diariasCategories.flatMap((cat) =>
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
          Confira o resumo do seu cadastro como contratante
        </p>
      </div>

      {/* Tipo e dados */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <Building className="h-5 w-5 text-warning" />
          <span className="text-sm font-bold text-foreground">Tipo</span>
        </div>
        <p className="text-sm text-muted-foreground ml-8">{tipoLabel}</p>
        {currentUser?.contratanteTipo === "pf" ? (
          <>
            <p className="text-sm font-medium text-foreground ml-8 mt-1">{currentUser.name}</p>
            <p className="text-sm text-muted-foreground ml-8">{currentUser.email}</p>
            {currentUser.phone && (
              <p className="text-sm text-accent ml-8">WhatsApp: {currentUser.phone}</p>
            )}
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground ml-8 mt-1">{currentUser?.empresa}</p>
            <p className="text-sm text-muted-foreground ml-8">{currentUser?.email}</p>
            {currentUser?.phone && (
              <p className="text-sm text-accent ml-8">WhatsApp: {currentUser.phone}</p>
            )}
          </>
        )}
      </div>

      {/* Areas selecionadas */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <Briefcase className="h-5 w-5 text-warning" />
          <span className="text-sm font-bold text-foreground">
            Areas de vagas ({selectedAreas.length})
          </span>
        </div>
        {selectedAreas.length > 0 ? (
          <div className="flex flex-wrap gap-2 ml-8">
            {selectedAreas.slice(0, 8).map((item) => (
              <span
                key={item.id}
                className="inline-flex rounded-lg bg-warning/10 px-3 py-1.5 text-xs font-medium text-warning"
              >
                {item.label}
              </span>
            ))}
            {selectedAreas.length > 8 && (
              <span className="inline-flex rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                +{selectedAreas.length - 8} mais
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground ml-8">Nenhuma selecionada</p>
        )}
      </div>
    </div>
  )
}
