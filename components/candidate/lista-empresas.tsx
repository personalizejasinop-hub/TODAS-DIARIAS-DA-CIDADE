"use client"

import { useState } from "react"
import { Search, Building, Phone, ChevronRight } from "lucide-react"
import { useContratantes } from "@/lib/hooks"

interface ProfileContratante {
  id: string
  name?: string
  empresa?: string
  email?: string
  phone?: string
  whatsapp?: string
  contratanteTipo?: string
}

export function ListaEmpresas() {
  const [searchQuery, setSearchQuery] = useState("")
  const { contratantes, isLoading, error } = useContratantes()

  const filtered = contratantes.filter((p: ProfileContratante) => {
    const name = (p.name || "").toLowerCase()
    const empresa = (p.empresa || "").toLowerCase()
    const email = (p.email || "").toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || empresa.includes(q) || email.includes(q)
  })

  const whatsappUrl = (p: ProfileContratante) => {
    const tel = (p.phone || p.whatsapp || "").replace(/\D/g, "")
    return tel ? `https://wa.me/55${tel}` : "#"
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 pb-24">
        <p className="text-destructive">Erro ao carregar empresas. Tente novamente.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-24">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Empresas e Contratantes</h1>
        <p className="text-sm text-muted-foreground">
          Veja todas as empresas cadastradas e entre em contato direto
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome ou empresa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground py-8 text-center">Carregando empresas...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">Nenhuma empresa encontrada</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p: ProfileContratante) => (
            <a
              key={p.id}
              href={whatsappUrl(p)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98] hover:bg-muted/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning/10">
                <Building className="h-6 w-6 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">
                  {p.empresa || p.name || p.email || "Contratante"}
                </p>
                <p className="text-sm text-muted-foreground truncate">{p.email}</p>
                <span className="text-xs text-muted-foreground capitalize">
                  {p.contratanteTipo === "pj" ? "Pessoa Jurídica" : "Pessoa Física"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Phone className="h-5 w-5 text-accent" />
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
