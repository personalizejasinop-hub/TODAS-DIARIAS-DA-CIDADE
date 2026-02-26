"use client"

import {
  Home,
  Briefcase,
  MessageCircle,
  User,
  LayoutDashboard,
  Users,
  Settings2,
  LogOut,
  ClipboardList,
  PlusCircle,
  AlertTriangle,
} from "lucide-react"
import { useAppStore } from "@/lib/store"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
  danger?: boolean
}

const CANDIDATE_TABS: NavItem[] = [
  {
    id: "home",
    label: "Inicio",
    icon: <Home className="h-5 w-5" />,
    activeIcon: <Home className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "candidaturas",
    label: "Candidaturas",
    icon: <ClipboardList className="h-5 w-5" />,
    activeIcon: <ClipboardList className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "mensagens",
    label: "Mensagens",
    icon: <MessageCircle className="h-5 w-5" />,
    activeIcon: <MessageCircle className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "perfil",
    label: "Perfil",
    icon: <User className="h-5 w-5" />,
    activeIcon: <User className="h-5 w-5" strokeWidth={2.5} />,
  },
]

const CONTRATANTE_TABS: NavItem[] = [
  {
    id: "minhas-vagas",
    label: "Vagas",
    icon: <Briefcase className="h-5 w-5" />,
    activeIcon: <Briefcase className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "criar-vaga",
    label: "Criar",
    icon: <PlusCircle className="h-5 w-5" />,
    activeIcon: <PlusCircle className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "mensagens",
    label: "Mensagens",
    icon: <MessageCircle className="h-5 w-5" />,
    activeIcon: <MessageCircle className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "perfil",
    label: "Perfil",
    icon: <User className="h-5 w-5" />,
    activeIcon: <User className="h-5 w-5" strokeWidth={2.5} />,
  },
]

const ADMIN_TABS: NavItem[] = [
  {
    id: "dashboard",
    label: "Painel",
    icon: <LayoutDashboard className="h-5 w-5" />,
    activeIcon: <LayoutDashboard className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "diarias",
    label: "Diarias",
    icon: <Settings2 className="h-5 w-5" />,
    activeIcon: <Settings2 className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "admin-vagas",
    label: "Vagas",
    icon: <Briefcase className="h-5 w-5" />,
    activeIcon: <Briefcase className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: <Users className="h-5 w-5" />,
    activeIcon: <Users className="h-5 w-5" strokeWidth={2.5} />,
  },
  {
    id: "denuncias",
    label: "Denuncias",
    icon: <AlertTriangle className="h-5 w-5" />,
    activeIcon: <AlertTriangle className="h-5 w-5" strokeWidth={2.5} />,
  },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { currentUser, logout } = useAppStore()

  const tabs =
    currentUser?.role === "admin"
      ? ADMIN_TABS
      : currentUser?.role === "contratante"
      ? CONTRATANTE_TABS
      : CANDIDATE_TABS

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 pt-1 pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive ? tab.activeIcon : tab.icon}
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-semibold"}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="h-0.5 w-4 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
