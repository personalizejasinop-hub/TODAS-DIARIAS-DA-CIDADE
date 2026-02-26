"use client"

import { GraduationCap, Check } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { ESCOLARIDADE_OPTIONS } from "@/lib/data"
import type { EscolaridadeOption } from "@/lib/types"

export function StepEscolaridade() {
  const { onboardingData, setEscolaridade } = useAppStore()

  return (
    <div className="flex flex-col gap-6 px-4 pb-32">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <GraduationCap className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Qual sua escolaridade?
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Selecione o nivel mais recente
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ESCOLARIDADE_OPTIONS.map((option) => {
          const isSelected = onboardingData.escolaridade === option.value
          return (
            <button
              key={option.value}
              onClick={() => setEscolaridade(option.value as EscolaridadeOption)}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <span
                className={`text-base font-medium ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}
              >
                {option.label}
              </span>
              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
