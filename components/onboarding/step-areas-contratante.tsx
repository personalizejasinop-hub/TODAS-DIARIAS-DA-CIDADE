"use client"

import { useState } from "react"
import { Briefcase, Check, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function StepAreasContratante() {
  const { onboardingData, toggleDiaria, diariasCategories, addDiariaItem } = useAppStore()
  const [showOutrasInput, setShowOutrasInput] = useState(false)
  const [outrasAreaText, setOutrasAreaText] = useState("")

  const areasSelecionadas = onboardingData.diariasSelecionadas

  return (
    <div className="flex flex-col gap-6 px-4 pb-32">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
          <Briefcase className="h-7 w-7 text-warning" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Quais areas de vagas voce vai publicar?
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Selecione as categorias para criar abas rapidas nas suas vagas
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {diariasCategories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">{cat.name}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.filter((i) => i.active || areasSelecionadas.includes(i.id)).map((item) => {
                const isSelected = areasSelecionadas.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleDiaria(item.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                      isSelected
                        ? "bg-warning text-warning-foreground"
                        : "border border-border bg-card text-foreground"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 inline-block mr-1 align-middle" />}
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Outras - custom area input */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setShowOutrasInput(!showOutrasInput)}
            className="flex w-full items-center justify-between p-4 active:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-warning" />
              <span className="text-base font-semibold text-foreground">Outras</span>
            </div>
            {showOutrasInput ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          {showOutrasInput && (
            <div className="border-t border-border p-4 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Nao encontrou? Digite a area de vaga que voce vai publicar:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Costura industrial"
                  value={outrasAreaText}
                  onChange={(e) => setOutrasAreaText(e.target.value)}
                  className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => {
                    if (outrasAreaText.trim()) {
                      const id = `outros-${Date.now()}`
                      addDiariaItem("outros", outrasAreaText.trim(), id)
                      toggleDiaria(id)
                      setOutrasAreaText("")
                    }
                  }}
                  disabled={!outrasAreaText.trim()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning text-warning-foreground active:opacity-80 disabled:opacity-40"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
