"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  User,
  ChevronRight,
  Phone,
  Briefcase,
  Clock,
  Eye,
  X,
} from "lucide-react"

interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  status: "completo" | "pendente" | "inativo"
  skills: number
  interest: string
  registeredAt: string
  disponibilidade: string[]
  transporte: string
}

const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    name: "Maria da Silva",
    email: "maria@email.com",
    phone: "(85) 99123-4567",
    status: "completo",
    skills: 12,
    interest: "Sim, WhatsApp",
    registeredAt: "Hoje 14:32",
    disponibilidade: ["Manha", "Tarde"],
    transporte: "Moto",
  },
  {
    id: "2",
    name: "Joao Santos",
    email: "joao@email.com",
    phone: "(85) 98765-4321",
    status: "completo",
    skills: 8,
    interest: "Sim, FDS",
    registeredAt: "Hoje 11:45",
    disponibilidade: ["Sabado", "Domingo"],
    transporte: "Bicicleta",
  },
  {
    id: "3",
    name: "Ana Oliveira",
    email: "ana@email.com",
    phone: "(85) 97654-3210",
    status: "pendente",
    skills: 5,
    interest: "Talvez",
    registeredAt: "Ontem 16:20",
    disponibilidade: ["Noites"],
    transporte: "Nao tem",
  },
  {
    id: "4",
    name: "Carlos Souza",
    email: "carlos@email.com",
    phone: "(85) 96543-2109",
    status: "completo",
    skills: 15,
    interest: "Sim, WhatsApp",
    registeredAt: "Ontem 09:10",
    disponibilidade: ["Manha", "Tarde", "Noites"],
    transporte: "Carro",
  },
  {
    id: "5",
    name: "Lucia Ferreira",
    email: "lucia@email.com",
    phone: "(85) 95432-1098",
    status: "inativo",
    skills: 3,
    interest: "Nao",
    registeredAt: "12/02",
    disponibilidade: [],
    transporte: "Nao tem",
  },
  {
    id: "6",
    name: "Pedro Mendes",
    email: "pedro@email.com",
    phone: "(85) 94321-0987",
    status: "completo",
    skills: 9,
    interest: "Sim, semana",
    registeredAt: "11/02",
    disponibilidade: ["Manha"],
    transporte: "Moto",
  },
]

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
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null)

  const filtered = MOCK_USERS.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter = filterStatus === "todos" || user.status === filterStatus
    return matchSearch && matchFilter
  })

  const statusFilters = ["todos", "completo", "pendente", "inativo"]

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">Gerenciar</span>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        </div>
        <div className="flex h-10 items-center gap-1 rounded-xl border border-border bg-card px-3">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{MOCK_USERS.length}</span>
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

      {/* Filter chips */}
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

      {/* Users list */}
      <div className="flex flex-col gap-2">
        {filtered.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-bold text-primary">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground truncate">{user.name}</span>
                <StatusBadge status={user.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{user.skills} habilidades</span>
                <span>{user.registeredAt}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>

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
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-foreground">{selectedUser.name}</span>
                  <span className="text-sm text-muted-foreground">{selectedUser.email}</span>
                </div>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Telefone</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{selectedUser.phone}</span>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Status</span>
                  </div>
                  <StatusBadge status={selectedUser.status} />
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Habilidades</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{selectedUser.skills}</span>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Cadastro</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{selectedUser.registeredAt}</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground">Interesse</span>
                  <span className="text-sm text-foreground">{selectedUser.interest}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground">Disponibilidade</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.disponibilidade.length > 0 ? (
                      selectedUser.disponibilidade.map((d) => (
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
                  <span className="text-sm text-foreground">{selectedUser.transporte}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pb-[env(safe-area-inset-bottom)]">
                <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground active:opacity-80">
                  <Phone className="h-4 w-4" />
                  Contatar
                </button>
                <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border text-sm font-bold text-foreground active:bg-muted">
                  <Eye className="h-4 w-4" />
                  Historico
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
