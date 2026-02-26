"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, User, ShieldCheck, ArrowLeft, Eye, EyeOff, Mail, Lock, KeyRound, UserPlus } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { signIn, resetPassword } from "@/lib/auth"

type AuthView = "welcome" | "login" | "register" | "recover"

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

interface LoginScreenProps {
  forceAdminLogin?: boolean
}

export function LoginScreen({ forceAdminLogin = false }: LoginScreenProps) {
  const router = useRouter()
  const { setUserFromProfile } = useAppStore()
  const [view, setView] = useState<AuthView>(forceAdminLogin ? "login" : "welcome")
  const [selectedRole, setSelectedRole] = useState<"candidato" | "contratante">("candidato")
  const [isAdminLogin, setIsAdminLogin] = useState(forceAdminLogin)
  const [showAdmin, setShowAdmin] = useState(forceAdminLogin)
  const [adminTaps, setAdminTaps] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [recoverSent, setRecoverSent] = useState(false)

  const handleDomainTap = () => {
    const next = adminTaps + 1
    setAdminTaps(next)
    if (next >= 5) {
      setShowAdmin(true)
      setAdminTaps(0)
    }
  }

  const handleRoleSelect = async (role: "candidato" | "contratante") => {
    setSelectedRole(role)
    setLoading(true)
    setError("")
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const res = await fetch("/api/profiles", { credentials: "include" })
        if (res.ok) {
          const profile = await res.json()
          setUserFromProfile(profile)
          return
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
    setView("login")
  }

  const handleLogin = async () => {
    setError("")
    if (!email || !password) {
      setError("Preencha todos os campos")
      return
    }

    setLoading(true)
    const { data, error: authError } = await signIn(email, password)

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else if (data.user) {
      setLoading(false)
      const res = await fetch("/api/profiles", { credentials: "include" })
      if (res.ok) {
        const profile = await res.json()
        if (isAdminLogin && profile.role !== "admin") {
          setError("Acesso negado. Apenas administradores podem acessar.")
          return
        }
        setUserFromProfile(profile)
      } else if (!isAdminLogin) {
        // Usa user_metadata do auth em vez do fallback "Maria Silva"
        const u = data.user
        setUserFromProfile({
          id: u.id,
          name: (u.user_metadata?.name ?? u.email?.split("@")[0] ?? "Usuário").trim(),
          email: u.email ?? "",
          role: selectedRole,
          onboardingComplete: false,
        })
      }
    }
  }

  const handleRegister = async () => {
    setError("")
    if (!name || !email || !phone || !password) {
      setError("Preencha todos os campos obrigatorios")
      return
    }

    const phoneDigits = phone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      setError("WhatsApp invalido. Informe DDD completo")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    setError("")

    try {
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          phone,
          role: selectedRole,
        }),
        credentials: "include",
      })

      let signupData: { error?: string; profile?: Record<string, unknown> } = {}
      try {
        signupData = await signupRes.json()
      } catch {
        signupData = { error: "Resposta invalida do servidor" }
      }

      if (!signupRes.ok) {
        setError(signupData.error ?? "Erro ao criar conta. Tente novamente.")
        setLoading(false)
        return
      }

      const { data, error: authError } = await signIn(email, password)

      if (authError) {
        setError("Conta criada. Faça login na tela Entrar.")
        setLoading(false)
        return
      }

      // Usa o perfil retornado pelo signup ou busca da API
      if (signupData.profile) {
        setUserFromProfile(signupData.profile)
      } else {
        const res = await fetch("/api/profiles", { credentials: "include" })
        if (res.ok) {
          const profile = await res.json()
          setUserFromProfile(profile)
        } else {
          setUserFromProfile({
            id: data.user.id,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            whatsapp: phone.trim(),
            role: selectedRole,
            onboardingComplete: false,
          })
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes("fetch") || msg.includes("network") || msg.includes("Failed")) {
        setError("Erro de conexao. Verifique sua internet e tente novamente.")
      } else {
        setError("Erro ao criar conta. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRecover = async () => {
    setError("")
    if (!email) {
      setError("Informe seu e-mail")
      return
    }

    setLoading(true)
    const { error: recoverError } = await resetPassword(email)

    if (recoverError) {
      setError(recoverError.message)
      setLoading(false)
    } else {
      setRecoverSent(true)
      setLoading(false)
    }
  }

  // WELCOME SCREEN
  if (view === "welcome") {
    return (
      <div className="flex min-h-dvh flex-col items-center bg-background px-6">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 to-transparent" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full max-w-sm">
          <div className="flex flex-col items-center gap-3 mb-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-lg shadow-primary/25">
              <Briefcase className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight text-center">
              Todas Diarias da Cidade
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 mb-10">
            <h2 className="text-2xl font-extrabold text-foreground text-center leading-tight text-balance">
              Sua proxima oportunidade a um clique de distancia.
            </h2>
            <p className="text-base text-muted-foreground text-center">
              Como voce quer usar o app?
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            <button
              onClick={() => handleRoleSelect("candidato")}
              disabled={loading}
              className="flex items-center gap-4 rounded-2xl bg-primary px-6 py-5 shadow-lg shadow-primary/20 transition-all active:scale-[0.97] disabled:opacity-70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                <User className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold text-primary-foreground">Sou Candidato</span>
                <span className="text-sm text-primary-foreground/80">Procurando por diarias</span>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("contratante")}
              disabled={loading}
              className="flex items-center gap-4 rounded-2xl bg-warning px-6 py-5 shadow-lg shadow-warning/20 transition-all active:scale-[0.97] disabled:opacity-70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-foreground/20">
                <Briefcase className="h-7 w-7 text-warning-foreground" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold text-warning-foreground">Sou Contratante</span>
                <span className="text-sm text-warning-foreground/80">Buscando profissionais</span>
              </div>
            </button>
          </div>

          {/* Entrar link */}
          <button
            onClick={() => setView("login")}
            className="mt-6 text-sm font-semibold text-primary underline underline-offset-4"
          >
            Ja tenho conta? Entrar
          </button>

          {showAdmin && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  setIsAdminLogin(true)
                  setView("login")
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 transition-all active:scale-[0.97]"
              >
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">Acesso Administrador</span>
              </button>
              <a
                href="/admin"
                className="text-xs text-muted-foreground underline"
              >
                Ou acesse diretamente: /admin
              </a>
            </div>
          )}
        </div>

        <div className="relative z-10 pb-8 pt-4">
          <button
            onClick={handleDomainTap}
            className="text-sm font-medium text-muted-foreground select-none"
            aria-label="todasdiariasdacidade.com.br"
          >
            todasdiariasdacidade.com.br
          </button>
        </div>
      </div>
    )
  }

  // LOGIN SCREEN
  if (view === "login") {
    return (
      <div className="flex min-h-dvh flex-col bg-background px-6">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/8 to-transparent" />

        <div className="relative z-10 flex flex-1 flex-col w-full max-w-sm mx-auto">
          <button
            onClick={() => {
              if (forceAdminLogin) {
                router.push("/")
              } else {
                setView("welcome")
                setIsAdminLogin(false)
              }
            }}
            className="mt-4 flex h-10 w-10 items-center justify-center rounded-full active:bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>

          <div className="flex flex-col gap-2 mt-6 mb-8">
            <h2 className="text-2xl font-extrabold text-foreground">
              {isAdminLogin ? "Entrar como Administrador" : "Entrar"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isAdminLogin ? (
                "Use suas credenciais de administrador"
              ) : (
                <>
                  Acesse sua conta como{" "}
                  <span className="font-bold text-primary">
                    {selectedRole === "candidato" ? "Candidato" : "Contratante"}
                  </span>
                </>
              )}
            </p>
          </div>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="E-mail ou CPF/CNPJ"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>

            <button
              onClick={() => setView("recover")}
              className="self-end text-sm font-semibold text-primary"
            >
              Esqueceu a senha?
            </button>

            <button
              onClick={handleLogin}
              disabled={!email || !password || loading}
              className="flex h-14 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground transition-all active:scale-[0.97] disabled:opacity-40"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center">{error}</div>}

            {!isAdminLogin && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-sm text-muted-foreground">Nao tem conta?</span>
              <button
                onClick={() => setView("register")}
                className="text-sm font-bold text-primary"
              >
                Cadastre-se
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // REGISTER SCREEN
  if (view === "register") {
    return (
      <div className="flex min-h-dvh flex-col bg-background px-6">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/8 to-transparent" />

        <div className="relative z-10 flex flex-1 flex-col w-full max-w-sm mx-auto">
          <button
            onClick={() => setView("login")}
            className="mt-4 flex h-10 w-10 items-center justify-center rounded-full active:bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>

          <div className="flex flex-col gap-2 mt-6 mb-8">
            <h2 className="text-2xl font-extrabold text-foreground">Criar conta</h2>
            <p className="text-sm text-muted-foreground">
              Cadastro como{" "}
              <span className="font-bold text-primary">
                {selectedRole === "candidato" ? "Candidato" : "Contratante"}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative">
              <UserPlus className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nome completo *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="E-mail *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="WhatsApp (00) 90000-0000 *"
                maxLength={15}
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha (min. 6 caracteres) *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>

            <button
              onClick={handleRegister}
              disabled={!name || !email || !phone || !password || loading}
              className="flex h-14 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground transition-all active:scale-[0.97] disabled:opacity-40"
            >
              {loading ? "Criando..." : "Criar Conta"}
            </button>

            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive text-center">{error}</div>}

            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="text-sm text-muted-foreground">Ja tem conta?</span>
              <button
                onClick={() => setView("login")}
                className="text-sm font-bold text-primary"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // RECOVER PASSWORD
  if (view === "recover") {
    return (
      <div className="flex min-h-dvh flex-col bg-background px-6">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/8 to-transparent" />

        <div className="relative z-10 flex flex-1 flex-col w-full max-w-sm mx-auto">
          <button
            onClick={() => setView("login")}
            className="mt-4 flex h-10 w-10 items-center justify-center rounded-full active:bg-muted"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>

          <div className="flex flex-col gap-2 mt-6 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">Recuperar senha</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Informe seu e-mail ou CPF/CNPJ e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          {recoverSent ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Mail className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground text-center">Link enviado!</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Verifique sua caixa de entrada e spam. O link expira em 30 minutos.
              </p>
              <button
                onClick={() => {
                  setRecoverSent(false)
                  setView("login")
                }}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-[0.97]"
              >
                Voltar para login
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="E-mail ou CPF/CNPJ"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={handleRecover}
                disabled={!email || loading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground active:scale-[0.97] disabled:opacity-40"
              >
                {loading ? "Enviando..." : "Enviar link"}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
