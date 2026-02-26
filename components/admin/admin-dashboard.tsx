"use client"

import {
  Users,
  Briefcase,
  TrendingUp,
  Bell,
  Eye,
  UserCheck,
  UserX,
  BarChart3,
} from "lucide-react"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  change?: string
  positive?: boolean
  bgColor: string
}

function StatCard({ icon, label, value, change, positive, bgColor }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgColor}`}>
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-bold ${
              positive ? "text-accent" : "text-destructive"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

interface RecentUserProps {
  name: string
  date: string
  status: "completo" | "pendente" | "inativo"
  skills: number
}

function RecentUser({ name, date, status, skills }: RecentUserProps) {
  const statusStyles: Record<string, string> = {
    completo: "bg-accent/10 text-accent",
    pendente: "bg-warning/10 text-warning",
    inativo: "bg-destructive/10 text-destructive",
  }
  const statusLabels: Record<string, string> = {
    completo: "Completo",
    pendente: "Pendente",
    inativo: "Inativo",
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <span className="text-sm font-bold text-primary">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="text-sm font-bold text-foreground truncate">{name}</span>
        <span className="text-xs text-muted-foreground">
          {date} - {skills} habilidades
        </span>
      </div>
      <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  )
}

export function AdminDashboard() {
  const recentUsers: RecentUserProps[] = [
    { name: "Maria Silva", date: "Hoje 14:32", status: "completo", skills: 12 },
    { name: "Joao Santos", date: "Hoje 11:45", status: "completo", skills: 8 },
    { name: "Ana Oliveira", date: "Ontem 16:20", status: "pendente", skills: 5 },
    { name: "Carlos Souza", date: "Ontem 09:10", status: "completo", skills: 15 },
    { name: "Lucia Ferreira", date: "12/02", status: "inativo", skills: 3 },
    { name: "Pedro Mendes", date: "11/02", status: "completo", skills: 9 },
  ]

  return (
    <div className="flex flex-col gap-5 pb-24 px-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">Painel</span>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
          <Bell className="h-5 w-5 text-foreground" />
          <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-destructive" />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Total cadastrados"
          value="1.247"
          change="+12%"
          positive
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5 text-accent" />}
          label="Onboarding completo"
          value="892"
          change="+8%"
          positive
          bgColor="bg-accent/10"
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          label="Diarias ativas"
          value="42"
          bgColor="bg-primary/10"
        />
        <StatCard
          icon={<Eye className="h-5 w-5 text-warning" />}
          label="Notificaveis"
          value="678"
          change="+5%"
          positive
          bgColor="bg-warning/10"
        />
      </div>

      {/* Quick charts row */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Cadastros esta semana</h2>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[45, 32, 58, 72, 40, 65, 88].map((value, i) => {
            const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]
            const isToday = i === 6
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    isToday ? "bg-primary" : "bg-primary/20"
                  }`}
                  style={{ height: `${(value / 100) * 100}%` }}
                />
                <span className={`text-[10px] font-medium ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {days[i]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top categories */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="text-base font-bold text-foreground">Diarias mais escolhidas</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { name: "Limpeza de casa", count: 423, pct: 85 },
            { name: "Ajudante de eventos", count: 381, pct: 76 },
            { name: "Garcom / copeiro", count: 298, pct: 60 },
            { name: "Entregas (delivery)", count: 256, pct: 51 },
            { name: "Servicos gerais", count: 234, pct: 47 },
          ].map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-xs font-bold text-muted-foreground">{item.count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent users */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Cadastros recentes</h2>
          <button className="text-sm font-semibold text-primary">Ver todos</button>
        </div>
        {recentUsers.map((user) => (
          <RecentUser key={user.name} {...user} />
        ))}
      </div>

      {/* Distribution */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <UserX className="h-5 w-5 text-destructive" />
          <h2 className="text-base font-bold text-foreground">Interesse em receber</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { label: "Sim, WhatsApp", pct: 54, color: "bg-accent" },
            { label: "Sim, FDS", pct: 18, color: "bg-primary" },
            { label: "Sim, semana", pct: 12, color: "bg-primary/60" },
            { label: "Talvez", pct: 10, color: "bg-warning" },
            { label: "Nao", pct: 6, color: "bg-destructive" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${item.color} shrink-0`} />
              <span className="flex-1 text-sm text-foreground">{item.label}</span>
              <span className="text-sm font-bold text-foreground">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
