"use client"

import { useState } from "react"
import { Search, CheckSquare, Square, ChevronDown, ChevronUp, Briefcase, Plus } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function StepDiarias() {
  const {
    onboardingData,
    diariasCategories,
    toggleDiaria,
    selectAllInCategory,
    deselectAllInCategory,
    selectAllDiarias,
    deselectAllDiarias,
    addDiariaItem,
  } = useAppStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showOutrasInput, setShowOutrasInput] = useState(false)
  const [outrasDiariaText, setOutrasDiariaText] = useState("")

  const selectedCount = onboardingData.diariasSelecionadas.length

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredCategories = diariasCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          (item.active || onboardingData.diariasSelecionadas.includes(item.id)) &&
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0)

  return (
    <div className="flex flex-col gap-4 px-4 pb-36">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Briefcase className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Diarias e Extras
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Marque as diarias em que voce tem habilidade e vontade
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar diaria..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Bulk actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={selectAllDiarias}
          className="text-sm font-semibold text-primary active:opacity-70"
        >
          Marcar tudo
        </button>
        <button
          onClick={deselectAllDiarias}
          className="text-sm font-semibold text-muted-foreground active:opacity-70"
        >
          Desmarcar tudo
        </button>
      </div>

      {/* Categories accordion */}
      <div className="flex flex-col gap-2">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id) || searchQuery.length > 0
          const catSelectedCount = category.items.filter((item) =>
            onboardingData.diariasSelecionadas.includes(item.id)
          ).length
          const allSelected = catSelectedCount === category.items.length && category.items.length > 0

          return (
            <div
              key={category.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between p-4 active:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-foreground">
                    {category.name}
                  </span>
                  {catSelectedCount > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
                      {catSelectedCount}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {/* Category items */}
              {isExpanded && (
                <div className="border-t border-border">
                  {/* Select/deselect all in category */}
                  <button
                    onClick={() =>
                      allSelected
                        ? deselectAllInCategory(category.id)
                        : selectAllInCategory(category.id)
                    }
                    className="flex w-full items-center gap-3 border-b border-border px-4 py-3 active:bg-muted/50"
                  >
                    {allSelected ? (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-semibold text-primary">
                      {allSelected ? "Desmarcar toda area" : "Marcar toda area"}
                    </span>
                  </button>

                  {category.items.map((item) => {
                    const isChecked = onboardingData.diariasSelecionadas.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleDiaria(item.id)}
                        className={`flex w-full items-center gap-3 px-4 py-3.5 transition-colors active:bg-muted/50 ${
                          isChecked ? "bg-primary/5" : ""
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                            isChecked
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              className="text-primary-foreground"
                            >
                              <path
                                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm leading-snug text-left ${
                            isChecked
                              ? "font-medium text-foreground"
                              : "text-foreground/80"
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Outras - custom diaria input */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setShowOutrasInput(!showOutrasInput)}
          className="flex w-full items-center justify-between p-4 active:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 text-primary" />
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
              Nao encontrou? Digite o nome da diaria que voce faz:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Costura industrial"
                value={outrasDiariaText}
                onChange={(e) => setOutrasDiariaText(e.target.value)}
                className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => {
                  if (outrasDiariaText.trim()) {
                    const id = `outros-${Date.now()}`
                    addDiariaItem("outros", outrasDiariaText.trim(), id)
                    toggleDiaria(id)
                    setOutrasDiariaText("")
                  }
                }}
                disabled={!outrasDiariaText.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground active:opacity-80 disabled:opacity-40"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer counter */}
      <div className="fixed bottom-20 left-0 right-0 z-20 px-4">
        <div className="mx-auto flex max-w-lg items-center justify-center rounded-full bg-primary px-5 py-2.5 shadow-lg">
          <span className="text-sm font-bold text-primary-foreground">
            Selecionadas: {selectedCount}
          </span>
        </div>
      </div>
    </div>
  )
}
