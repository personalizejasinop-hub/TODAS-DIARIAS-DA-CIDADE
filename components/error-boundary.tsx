"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-6">
          <div className="flex max-w-sm flex-col gap-4 text-center">
            <p className="text-base font-medium text-foreground">
              Ocorreu um erro ao carregar.
            </p>
            <p className="text-sm text-muted-foreground">
              Tente recarregar a pagina ou limpar os dados do site.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground active:scale-[0.98]"
              >
                Recarregar
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem("diarias-app-storage")
                    sessionStorage.clear()
                    window.location.reload()
                  } catch {
                    window.location.reload()
                  }
                }}
                className="rounded-xl border border-border px-6 py-3 text-sm font-bold text-foreground active:scale-[0.98]"
              >
                Limpar e recarregar
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
