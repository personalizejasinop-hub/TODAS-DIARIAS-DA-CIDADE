"use client"

import { Building, User, Check } from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { ContratanteTipo } from "@/lib/types"

export function StepTipoContratante() {
  const { currentUser, updateProfile } = useAppStore()
  const tipo = currentUser?.contratanteTipo

  const handleSelect = (t: ContratanteTipo) => {
    updateProfile({ contratanteTipo: t })
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-32">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
          <Building className="h-7 w-7 text-warning" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Voce e pessoa fisica ou juridica?
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Isso define os dados que vamos pedir
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleSelect("pf")}
          className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all active:scale-[0.98] ${
            tipo === "pf" ? "border-warning bg-warning/5" : "border-border bg-card"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <User className="h-6 w-6 text-warning" />
            </div>
            <div className="text-left">
              <span className={`text-base font-medium ${tipo === "pf" ? "text-warning" : "text-foreground"}`}>
                Pessoa Fisica (PF)
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Contratando em nome proprio
              </p>
            </div>
          </div>
          {tipo === "pf" && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning">
              <Check className="h-4 w-4 text-warning-foreground" />
            </div>
          )}
        </button>

        <button
          onClick={() => handleSelect("pj")}
          className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all active:scale-[0.98] ${
            tipo === "pj" ? "border-warning bg-warning/5" : "border-border bg-card"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Building className="h-6 w-6 text-warning" />
            </div>
            <div className="text-left">
              <span className={`text-base font-medium ${tipo === "pj" ? "text-warning" : "text-foreground"}`}>
                Pessoa Juridica (PJ)
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Empresa, CNPJ, estabelecimento
              </p>
            </div>
          </div>
          {tipo === "pj" && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning">
              <Check className="h-4 w-4 text-warning-foreground" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
