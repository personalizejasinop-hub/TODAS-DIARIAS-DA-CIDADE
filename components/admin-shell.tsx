"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAppStore } from "@/lib/store"
import { LoginScreen } from "./login-screen"
import { BottomNav } from "./bottom-nav"
import { AdminDashboard } from "./admin/admin-dashboard"
import { AdminDiarias } from "./admin/admin-diarias"
import { AdminUsers } from "./admin/admin-users"
import { AdminVagas } from "./admin/admin-vagas"
import { AdminDenuncias } from "./admin/admin-denuncias"

export function AdminShell() {
  const router = useRouter()
  const { currentUser, setUserFromProfile, isLoggedIn } = useAppStore()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)

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
          setUserFromProfile(profile)
        } else {
          const u = session.user
          setUserFromProfile({
            id: u.id,
            name: (u.user_metadata?.name ?? u.email?.split("@")[0] ?? "Usuário").trim(),
            email: u.email ?? "",
            role: u.user_metadata?.role ?? "candidato",
            onboardingComplete: false,
          })
        }
      }
      setLoading(false)
    }

    loadSession()
  }, [setUserFromProfile])

  useEffect(() => {
    if (!loading && isLoggedIn && currentUser && currentUser.role !== "admin") {
      router.replace("/")
    }
  }, [loading, isLoggedIn, currentUser, router])

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-foreground">Carregando...</p>
      </div>
    )
  }

  if (!isLoggedIn || !currentUser) {
    return <LoginScreen forceAdminLogin />
  }

  if (currentUser.role !== "admin") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-4">
        <p className="text-center text-muted-foreground">Acesso negado. Apenas administradores.</p>
      </div>
    )
  }

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
