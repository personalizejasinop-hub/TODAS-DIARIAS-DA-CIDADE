"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Search,
  User,
  ChevronRight,
  Phone,
  Briefcase,
  Clock,
  Eye,
  X,
} from "lucide-react"

interface ProfileUser {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  role: string
  onboardingComplete?: boolean
  diariasSelecionadas?: string[]
  disponibilidade?: string[]
  transporte?: string
  interesse?: string
  empresa?: string
  createdAt?: string
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" })
    .then((r) => r.json())
    .then((body) => {
      if (body && typeof body === "object" && "error" in body) throw new Error(String(body.error))
      return body
    })

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A"
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return `Hoje ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
  if (diffDays === 1) return `Ontem ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
  if (diffDays < 7) return `${diffDays}d atras`
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completo: "bg-accent/10 text-accent",
    pendente: "bg-warning/10 text-warning",
    inativo: "bg-destructive/10 text-destructive",
  }
  const labels: Record<string, string> = {
    completo: "Completo",
    pendente: "Pendente",
    inativo: "Inativo",
  }
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [filterRole, setFilterRole] = useState<string>("todos")
  const [selectedUser, setSelectedUser] = useState<ProfileUser | null>(null)

  const { data: users = [], error, isLoading, mutate } = useSWR<ProfileUser[]>("/api/admin/users", fetcher)

  const filtered = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.empresa?.toLowerCase().includes(searchQuery.toLowerCase())
    const status = user.onboardingComplete ? "completo" : "pendente"
    const matchFilter = filterStatus === "todos" || status === filterStatus
    const matchRole = filterRole === "todos" || user.role === filterRole
    return matchSearch && matchFilter && matchRole
  })

  const statusFilters = ["todos", "completo", "pendente"]
  const roleFilters = ["todos", "candidato", "contratante", "admin"]

  if (error) {
    return (
      <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
        <p className="text-destructive">Erro ao carregar usuarios. Tente novamente.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">Gerenciar</span>
          <h1 className="text-2xl font-bold text-foreground">Usuarios cadastrados</h1>
        </div>
        <div className="flex h-10 items-center gap-1 rounded-xl border border-border bg-card px-3">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{users.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter chips - Status */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              filterStatus === status
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            {status === "todos" ? "Todos" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      {/* Filter chips - Role */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {roleFilters.map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              filterRole === role
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground border border-border"
            }`}
          >
            {role === "todos" ? "Todos" : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* Users list */}
      {isLoading ? (
        <p className="text-muted-foreground py-8 text-center">Carregando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">Nenhum usuario encontrado</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((user) => {
            const status = user.onboardingComplete ? "completo" : "pendente"
            const skills = user.diariasSelecionadas?.length ?? 0
            return (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all active:scale-[0.98]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">
                    {(user.name || user.empresa || "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground truncate">
                      {user.empresa || user.name || user.email}
                    </span>
                    <StatusBadge status={status} />
                    <span className="text-[10px] text-muted-foreground capitalize">{user.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{skills} habilidades</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </button>
            )
          })}
        </div>
      )}

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-card max-h-[85dvh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-4 rounded-t-3xl">
              <h2 className="text-lg font-bold text-foreground">Detalhes</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full active:bg-muted"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-4 p-4">
              {/* User header */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">
                    {(selectedUser.name || selectedUser.empresa || "?").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-foreground">
                    {selectedUser.empresa || selectedUser.name || selectedUser.email}
                  </span>
                  <span className="text-sm text-muted-foreground">{selectedUser.email}</span>
                  <span className="text-xs text-muted-foreground capitalize">{selectedUser.role}</span>
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Telefone</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {selectedUser.phone || selectedUser.whatsapp || "Nao informado"}
                  </span>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Status</span>
                  </div>
                  <StatusBadge status={selectedUser.onboardingComplete ? "completo" : "pendente"} />
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Habilidades</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {selectedUser.diariasSelecionadas?.length ?? 0}
                  </span>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Cadastro</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
                {(selectedUser.interesse || selectedUser.role === "candidato") && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-muted-foreground">Interesse</span>
                    <span className="text-sm text-foreground">{selectedUser.interesse || "Nao informado"}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground">Disponibilidade</span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedUser.disponibilidade?.length ?? 0) > 0 ? (
                      selectedUser.disponibilidade!.map((d) => (
                        <span key={d} className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Nao informado</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground">Transporte</span>
                  <span className="text-sm text-foreground">{selectedUser.transporte || "Nao informado"}</span>
                </div>
              </div>

              {/* Actions */}
              <a
                href={`https://wa.me/55${(selectedUser.phone || selectedUser.whatsapp || "").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground active:opacity-80"
              >
                <Phone className="h-4 w-4" />
                Contatar via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
