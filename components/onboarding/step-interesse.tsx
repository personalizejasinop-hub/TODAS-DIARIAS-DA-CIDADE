"use client"

import { useCallback } from "react"
import { Bell, Check, MessageCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { INTERESSE_OPTIONS } from "@/lib/data"
import type { InteresseOption } from "@/lib/types"

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function StepInteresse() {
  const { onboardingData, setInteresse, setWhatsapp } = useAppStore()

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value)
      setWhatsapp(formatted)
    },
    [setWhatsapp]
  )

  return (
    <div className="flex flex-col gap-6 px-4 pb-32">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Bell className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Interesse em receber oportunidades
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Voce quer receber oportunidades de diarias/extras?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {INTERESSE_OPTIONS.map((option) => {
          const isSelected = onboardingData.interesse === option.value
          return (
            <button
              key={option.value}
              onClick={() => setInteresse(option.value as InteresseOption)}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <span
                className={`text-base font-medium text-left ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}
              >
                {option.label}
              </span>
              {isSelected && (
                <div className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {(onboardingData.interesse === "sim_whatsapp" ||
        onboardingData.interesse === "sim_fds" ||
        onboardingData.interesse === "sim_semana") && (
        <div className="flex flex-col gap-3 rounded-xl border-2 border-accent bg-accent/5 p-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            <span className="font-semibold text-foreground">Confirme seu WhatsApp</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="(00) 90000-0000"
            maxLength={15}
            value={onboardingData.whatsapp || ""}
            onChange={handlePhoneChange}
            className="h-12 rounded-lg border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Ao informar seu WhatsApp, voce concorda em receber notificacoes de oportunidades de diarias.
          </p>
        </div>
      )}

      {onboardingData.interesse === "nao" && (
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Tudo bem! Voce pode continuar o cadastro normalmente, mas ficara como &quot;nao notificavel&quot;. Pode alterar essa opcao a qualquer momento.
          </p>
        </div>
      )}
    </div>
  )
}
