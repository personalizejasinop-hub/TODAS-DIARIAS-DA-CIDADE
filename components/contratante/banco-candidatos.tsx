"use client"

import { useState } from "react"
import { Search, User, Phone, Star, ChevronRight } from "lucide-react"
import { useCandidates } from "@/lib/hooks"

interface ProfileUser {
  id: string
  name?: string
  email?: string
  phone?: string
  whatsapp?: string
  diariasSelecionadas?: string[]
  avaliacaoMedia?: number
  totalAvaliacoes?: number
}

export function BancoCandidatos() {
  const [searchQuery, setSearchQuery] = useState("")
  const { candidates, isLoading, error } = useCandidates()

  const filtered = candidates.filter((p: ProfileUser) => {
    const name = (p.name || "").toLowerCase()
    const email = (p.email || "").toLowerCase()
    const q = searchQuery.toLowerCase()
    return name.includes(q) || email.includes(q)
  })

  const whatsappUrl = (p: ProfileUser) => {
    const tel = (p.phone || p.whatsapp || "").replace(/\D/g, "")
    return tel ? `https://wa.me/55${tel}` : "#"
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4 pb-24">
        <p className="text-destructive">Erro ao carregar candidatos. Tente novamente.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-24">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Banco de Candidatos</h1>
        <p className="text-sm text-muted-foreground">
          Veja todos os profissionais cadastrados e entre em contato direto
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground py-8 text-center">Carregando candidatos...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">Nenhum candidato encontrado</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p: ProfileUser) => (
            <a
              key={p.id}
              href={whatsappUrl(p)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98] hover:bg-muted/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {(p.name || p.email || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">{p.name || p.email || "Candidato"}</p>
                <p className="text-sm text-muted-foreground truncate">{p.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {(p.diariasSelecionadas?.length ?? 0)} habilidades
                  </span>
                  {(p.avaliacaoMedia ?? 0) > 0 && (
                    <span className="flex items-center gap-0.5 text-xs">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      {Number(p.avaliacaoMedia).toFixed(1)}
                    </span>
                  )}
                </div>
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
