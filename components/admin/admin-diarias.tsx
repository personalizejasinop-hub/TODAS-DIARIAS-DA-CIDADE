"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Search,
  Settings2,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react"
import { useAppStore } from "@/lib/store"

export function AdminDiarias() {
  const {
    diariasCategories,
    toggleDiariaActive,
    addDiariaItem,
    reorderCategory,
    addCategory,
  } = useAppStore()

  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>({})
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleAddItem = (categoryId: string) => {
    const label = newItemInputs[categoryId]?.trim()
    if (label) {
      addDiariaItem(categoryId, label)
      setNewItemInputs((prev) => ({ ...prev, [categoryId]: "" }))
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim())
      setNewCategoryName("")
      setShowAddCategory(false)
    }
  }

  const filteredCategories = diariasCategories
    .map((cat) => ({
      ...cat,
      items: searchQuery
        ? cat.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : cat.items,
    }))
    .filter((cat) => (searchQuery ? cat.items.length > 0 : true))

  const totalItems = diariasCategories.reduce((sum, cat) => sum + cat.items.length, 0)
  const activeItems = diariasCategories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.active).length,
    0
  )

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">Gerenciar</span>
          <h1 className="text-2xl font-bold text-foreground">Diarias</h1>
        </div>
        <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3">
          <Settings2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            {activeItems}/{totalItems}
          </span>
        </div>
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

      {/* Categories */}
      <div className="flex flex-col gap-2">
        {filteredCategories.map((category, catIndex) => {
          const isExpanded = expandedCategories.includes(category.id) || searchQuery.length > 0
          const activeCount = category.items.filter((i) => i.active).length

          return (
            <div
              key={category.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              {/* Category header */}
              <div className="flex items-center">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex flex-1 items-center justify-between p-4 active:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-foreground">
                      {category.name}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                      {activeCount}/{category.items.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex items-center gap-1 pr-2">
                  <button
                    onClick={() => reorderCategory(category.id, "up")}
                    disabled={catIndex === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg active:bg-muted disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => reorderCategory(category.id, "down")}
                    disabled={catIndex === filteredCategories.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg active:bg-muted disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Items */}
              {isExpanded && (
                <div className="border-t border-border">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
                    >
                      <span
                        className={`text-sm ${
                          item.active ? "text-foreground" : "text-muted-foreground line-through"
                        }`}
                      >
                        {item.label}
                      </span>
                      <button
                        onClick={() => toggleDiariaActive(category.id, item.id)}
                        title={item.active ? "Desativar" : "Autorizar"}
                        className={`relative h-7 w-12 rounded-full transition-colors ${
                          item.active ? "bg-accent" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow-sm transition-all ${
                            item.active ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                          }`}
                        />
                      </button>
                      {!item.active && (
                        <span className="text-[10px] text-muted-foreground ml-1">pendente</span>
                      )}
                    </div>
                  ))}

                  {/* Add new item */}
                  <div className="flex items-center gap-2 border-t border-border p-3">
                    <input
                      type="text"
                      placeholder="Nova diaria..."
                      value={newItemInputs[category.id] || ""}
                      onChange={(e) =>
                        setNewItemInputs((prev) => ({
                          ...prev,
                          [category.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddItem(category.id)
                      }}
                      className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => handleAddItem(category.id)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary active:opacity-80"
                    >
                      <Plus className="h-5 w-5 text-primary-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add category */}
      {showAddCategory ? (
        <div className="flex flex-col gap-3 rounded-xl border-2 border-primary bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Nova Categoria</span>
            <button onClick={() => setShowAddCategory(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Nome da categoria..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCategory()
            }}
            className="h-12 rounded-lg border border-input bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <button
            onClick={handleAddCategory}
            className="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground active:opacity-80"
          >
            Criar Categoria
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-base font-bold text-muted-foreground active:bg-muted/50"
        >
          <Plus className="h-5 w-5" />
          Nova Categoria
        </button>
      )}
    </div>
  )
}
