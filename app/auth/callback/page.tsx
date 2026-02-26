"use client"

import { Suspense, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

function AuthCallbackContent() {
  const searchParams = useSearchParams()
  const didRedirect = useRef(false)

  useEffect(() => {
    if (didRedirect.current) return
    didRedirect.current = true
    const code = searchParams.get("code")
    if (code) {
      const params = searchParams.toString()
      window.location.replace(`/api/auth/callback?${params}`)
    } else {
      window.location.replace("/")
    }
  }, [searchParams])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
