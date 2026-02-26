"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { updateProfile } from "@/lib/hooks"
import { StepEscolaridade } from "./step-escolaridade"
import { StepInteresse } from "./step-interesse"
import { StepDiarias } from "./step-diarias"
import { StepDisponibilidade } from "./step-disponibilidade"
import { StepResumo } from "./step-resumo"
import { StepTipoContratante } from "./step-tipo-contratante"
import { StepDadosContratante } from "./step-dados-contratante"
import { StepAreasContratante } from "./step-areas-contratante"
import { StepResumoContratante } from "./step-resumo-contratante"

const CANDIDATO_STEPS = [
  { id: 1, title: "Escolaridade" },
  { id: 2, title: "Interesse" },
  { id: 3, title: "Diarias" },
  { id: 4, title: "Disponibilidade" },
  { id: 5, title: "Resumo" },
]

const CONTRATANTE_STEPS = [
  { id: 1, title: "Tipo" },
  { id: 2, title: "Dados" },
  { id: 3, title: "Areas" },
  { id: 4, title: "Resumo" },
]

function canAdvanceCandidato(step: number, data: ReturnType<typeof useAppStore>["onboardingData"]) {
  switch (step) {
    case 1:
      return !!data.escolaridade
    case 2:
      return !!data.interesse
    case 3:
      return data.diariasSelecionadas.length > 0
    case 4:
      return data.disponibilidade.length > 0 && !!data.horasPorSemana && !!data.transporte
    case 5:
      return true
    default:
      return false
  }
}

function canAdvanceContratante(
  step: number,
  data: ReturnType<typeof useAppStore>["onboardingData"],
  currentUser: ReturnType<typeof useAppStore>["currentUser"]
) {
  switch (step) {
    case 1:
      return !!currentUser?.contratanteTipo
    case 2:
      if (currentUser?.contratanteTipo === "pf") {
        return !!currentUser?.name && !!currentUser?.cpf && !!currentUser?.email && !!currentUser?.phone
      }
      return !!currentUser?.empresa && !!currentUser?.cnpj && !!currentUser?.email && !!currentUser?.phone
    case 3:
      return data.diariasSelecionadas.length > 0
    case 4:
      return true
    default:
      return false
  }
}

export function OnboardingFlow() {
  const {
    currentUser,
    onboardingStep,
    setOnboardingStep,
    onboardingData,
    completeOnboarding,
    setUserFromProfile,
  } = useAppStore()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const isContratante = currentUser?.role === "contratante"
  const STEPS = isContratante ? CONTRATANTE_STEPS : CANDIDATO_STEPS
  const totalSteps = STEPS.length

  const canAdvance = isContratante
    ? canAdvanceContratante(onboardingStep, onboardingData, currentUser)
    : canAdvanceCandidato(onboardingStep, onboardingData)

  const progress = (onboardingStep / totalSteps) * 100

  const handleNext = async () => {
    if (onboardingStep === totalSteps) {
      setSubmitting(true)
      setError("")
      try {
        const payload: Record<string, unknown> = {
          onboardingComplete: true,
          diariasSelecionadas: onboardingData.diariasSelecionadas,
        }
        if (isContratante) {
          payload.contratanteTipo = currentUser?.contratanteTipo
          payload.cpf = currentUser?.cpf
          payload.cnpj = currentUser?.cnpj
          payload.empresa = currentUser?.empresa
          payload.name = currentUser?.contratanteTipo === "pj" ? (currentUser?.empresa ?? currentUser?.name) : currentUser?.name
          payload.email = currentUser?.email
          payload.phone = currentUser?.phone
          payload.whatsapp = currentUser?.whatsapp ?? currentUser?.phone
        } else {
          payload.escolaridade = onboardingData.escolaridade
          payload.interesse = onboardingData.interesse
          payload.whatsapp = onboardingData.whatsapp
          payload.disponibilidade = onboardingData.disponibilidade
          payload.horasPorSemana = onboardingData.horasPorSemana
          payload.transporte = onboardingData.transporte
        }
        const res = await updateProfile(payload)
        if (res?.id || (res && !res.error)) {
          if (res && typeof res === "object" && "id" in res) {
            setUserFromProfile(res as Record<string, unknown>)
          }
          completeOnboarding()
        } else {
          setError(String(res?.error ?? "Erro ao salvar. Tente novamente."))
        }
      } catch (e) {
        setError("Erro ao salvar. Tente novamente.")
      } finally {
        setSubmitting(false)
      }
    } else {
      setOnboardingStep(onboardingStep + 1)
    }
  }

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleBack}
            disabled={onboardingStep === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:opacity-30 active:bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-primary">
              Passo {onboardingStep} de {totalSteps}
            </span>
            <span className="text-xs text-muted-foreground">
              {STEPS[onboardingStep - 1].title}
            </span>
          </div>
          <div className="h-10 w-10" />
        </div>
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-4">
        {isContratante ? (
          <>
            {onboardingStep === 1 && <StepTipoContratante />}
            {onboardingStep === 2 && <StepDadosContratante />}
            {onboardingStep === 3 && <StepAreasContratante />}
            {onboardingStep === 4 && <StepResumoContratante />}
          </>
        ) : (
          <>
            {onboardingStep === 1 && <StepEscolaridade />}
            {onboardingStep === 2 && <StepInteresse />}
            {onboardingStep === 3 && <StepDiarias />}
            {onboardingStep === 4 && <StepDisponibilidade />}
            {onboardingStep === 5 && <StepResumo />}
          </>
        )}
      </main>

      {error && (
        <div className="px-4 py-2">
          <p className="text-sm text-destructive text-center">{error}</p>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card px-4 pb-[env(safe-area-inset-bottom)] pt-3">
        <div className="mx-auto flex max-w-lg gap-3 pb-3">
          {onboardingStep > 1 && (
            <button
              onClick={handleBack}
              disabled={submitting}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border bg-card text-base font-bold text-foreground transition-all active:scale-[0.97] disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
              Voltar
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canAdvance || submitting}
            className="flex h-14 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground transition-all active:scale-[0.97] disabled:opacity-40"
          >
            {onboardingStep === totalSteps ? (
              <>
                <Check className="h-5 w-5" />
                {submitting ? "Salvando..." : "Confirmar cadastro"}
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
