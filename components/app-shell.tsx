"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import { LoginScreen } from "./login-screen"
import { OnboardingFlow } from "./onboarding/onboarding-flow"
import { BottomNav } from "./bottom-nav"

// Candidate screens
import { CandidateHome } from "./candidate/candidate-home"
import { Candidaturas } from "./candidate/candidaturas"
import { CandidateProfile } from "./candidate/candidate-profile"
import { VagaDetail } from "./candidate/vaga-detail"

// Contratante screens
import { MinhasVagas } from "./contratante/minhas-vagas"
import { CriarVaga } from "./contratante/criar-vaga"
import { ContratanteProfile } from "./contratante/contratante-profile"
import { GestaoCandidatos } from "./contratante/gestao-candidatos"

// Shared screens
import { MessagesInbox } from "./shared/messages-inbox"
import { ChatView } from "./shared/chat-view"

// Admin screens
import { AdminDashboard } from "./admin/admin-dashboard"
import { AdminDiarias } from "./admin/admin-diarias"
import { AdminUsers } from "./admin/admin-users"
import { AdminVagas } from "./admin/admin-vagas"
import { AdminDenuncias } from "./admin/admin-denuncias"

import type { Vaga } from "@/lib/types"
import { User, Briefcase } from "lucide-react"

function RoleBanner({ role, userName, empresa }: { role: string; userName?: string; empresa?: string }) {
  const isCandidato = role === "candidato"
  const displayName = empresa || userName?.split(" ")[0] || (isCandidato ? "Candidato" : "Contratante")
  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold ${
        isCandidato
          ? "bg-primary/10 text-primary"
          : "bg-warning/10 text-warning"
      }`}
    >
      {isCandidato ? (
        <User className="h-3.5 w-3.5" />
      ) : (
        <Briefcase className="h-3.5 w-3.5" />
      )}
      {displayName}
    </div>
  )
}

type Overlay =
  | null
  | { type: "vaga-detail"; vaga: Vaga }
  | { type: "chat"; vagaId: string; participantName?: string; vagaTitulo?: string; receiverId?: string }
  | { type: "criar-vaga" }
  | { type: "gestao-candidatos"; vaga: Vaga }

export function AppShell() {
  const { isLoggedIn, currentUser, switchMode, setUserFromProfile, logout } = useAppStore()
  const [activeTab, setActiveTab] = useState("home")
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [loading, setLoading] = useState(true)

  // Load user from Supabase session on mount
  useEffect(() => {
    const loadSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const res = await fetch("/api/profiles", { credentials: "include" })
        if (res.ok) {
          const profile = await res.json()
          const store = useAppStore.getState()
          if (store.currentUser?.onboardingComplete && store.currentUser?.id === profile.id && !profile.onboardingComplete) {
            setUserFromProfile({ ...profile, onboardingComplete: true })
          } else {
            setUserFromProfile(profile)
          }
        } else {
          // Evita usar dados fixos do persist; usa user_metadata da sessão
          const u = session.user
          setUserFromProfile({
            id: u.id,
            name: (u.user_metadata?.name ?? u.email?.split("@")[0] ?? "Usuário").trim(),
            email: u.email ?? "",
            phone: u.user_metadata?.phone,
            role: u.user_metadata?.role ?? "candidato",
            onboardingComplete: false,
          })
        }
      }
      setLoading(false)
    }

    loadSession()
  }, [setUserFromProfile])

  // Listen for auth changes (sign out)
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        logout()
      }
    })
    return () => subscription.unsubscribe()
  }, [logout])

  // Reset tab when role changes
  useEffect(() => {
    if (currentUser?.role === "admin") {
      setActiveTab("dashboard")
    } else if (currentUser?.role === "contratante") {
      setActiveTab("minhas-vagas")
    } else {
      setActiveTab("home")
    }
    setOverlay(null)
  }, [currentUser?.role])

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!isLoggedIn || !currentUser) {
    return <LoginScreen />
  }

  // Candidate / Contratante needs onboarding
  if (
    (currentUser.role === "candidato" || currentUser.role === "contratante") &&
    !currentUser.onboardingComplete
  ) {
    return <OnboardingFlow />
  }

  // --- Overlay screens (full screen on top) ---
  if (overlay) {
    if (overlay.type === "vaga-detail") {
      return (
        <VagaDetail
          vaga={overlay.vaga}
          onBack={() => setOverlay(null)}
          onCandidatar={() => setOverlay(null)}
        />
      )
    }
    if (overlay.type === "chat") {
      return (
        <ChatView
          vagaId={overlay.vagaId}
          participantName={overlay.participantName}
          vagaTitulo={overlay.vagaTitulo}
          receiverId={overlay.receiverId}
          onBack={() => setOverlay(null)}
        />
      )
    }
    if (overlay.type === "criar-vaga") {
      return (
        <CriarVaga
          onBack={() => setOverlay(null)}
          onCreated={() => {
            setOverlay(null)
            setActiveTab("minhas-vagas")
          }}
        />
      )
    }
    if (overlay.type === "gestao-candidatos") {
      return (
        <GestaoCandidatos
          vaga={overlay.vaga}
          onBack={() => setOverlay(null)}
          onOpenChat={(vagaId, participantName, opts) => setOverlay({ type: "chat", vagaId, participantName, ...opts })}
        />
      )
    }
  }

  // --- Candidate / Contratante app ---
  if (currentUser.role === "candidato") {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <RoleBanner role="candidato" userName={currentUser.name} />
        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === "home" && (
            <CandidateHome
              onOpenVaga={(vaga) => setOverlay({ type: "vaga-detail", vaga })}
            />
          )}
          {activeTab === "candidaturas" && (
            <Candidaturas
              onOpenChat={(vagaId, participantName, opts) => setOverlay({ type: "chat", vagaId, participantName, ...opts })}
            />
          )}
          {activeTab === "mensagens" && (
            <MessagesInbox
              onOpenChat={(vagaId, participantName, opts) => setOverlay({ type: "chat", vagaId, participantName, ...opts })}
            />
          )}
          {activeTab === "perfil" && <CandidateProfile />}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  if (currentUser.role === "contratante") {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <RoleBanner role="contratante" userName={currentUser.name} empresa={currentUser.empresa} />
        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === "minhas-vagas" && (
            <MinhasVagas
              onCreateVaga={() => setOverlay({ type: "criar-vaga" })}
              onViewVaga={(vaga) => setOverlay({ type: "gestao-candidatos", vaga })}
            />
          )}
          {activeTab === "criar-vaga" && (
            <CriarVaga
              onBack={() => setActiveTab("minhas-vagas")}
              onCreated={() => setActiveTab("minhas-vagas")}
            />
          )}
          {activeTab === "mensagens" && (
            <MessagesInbox
              onOpenChat={(vagaId, participantName, opts) => setOverlay({ type: "chat", vagaId, participantName, ...opts })}
            />
          )}
          {activeTab === "perfil" && (
            <ContratanteProfile onSwitchMode={switchMode} />
          )}
        </main>
        {activeTab !== "criar-vaga" && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    )
  }

  // --- Admin app ---
  if (currentUser.role === "admin") {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "diarias" && <AdminDiarias />}
          {activeTab === "admin-vagas" && <AdminVagas />}
          {activeTab === "usuarios" && <AdminUsers />}
          {activeTab === "denuncias" && <AdminDenuncias />}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  return <LoginScreen />
}
