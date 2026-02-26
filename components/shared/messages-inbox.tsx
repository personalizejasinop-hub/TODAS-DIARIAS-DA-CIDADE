"use client"

import { MessageCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useCandidaturas } from "@/lib/hooks"
import { useMessages } from "@/lib/hooks"

interface MessagesInboxProps {
  onOpenChat: (vagaId: string, participantName: string, opts?: { vagaTitulo?: string; receiverId?: string }) => void
}

function formatTimestamp(iso: string) {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return "Agora"
    if (diff < 86400000) return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    if (diff < 172800000) return "Ontem"
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  } catch {
    return ""
  }
}

export function MessagesInbox({ onOpenChat }: MessagesInboxProps) {
  const { currentUser } = useAppStore()
  const { candidaturas, isLoading } = useCandidaturas()
  const { messages } = useMessages()

  const isCandidato = currentUser?.role === "candidato"

  const conversations = candidaturas
    .filter((c: { status: string }) =>
      ["selecionado", "em_analise", "convidado", "enviada"].includes(c.status)
    )
    .map((c: { vagaId: string; vagaTitulo: string; contratanteNome: string; candidatoNome: string; contratanteId: string; candidatoId: string }) => {
      const vagaMessages = messages.filter((m: { vagaId: string }) => m.vagaId === c.vagaId)
      const lastMsg = vagaMessages[vagaMessages.length - 1]
      const participantName = isCandidato ? (c.contratanteNome || "Contratante") : (c.candidatoNome || "Candidato")
      const receiverId = isCandidato ? c.contratanteId : c.candidatoId
      return {
        vagaId: c.vagaId,
        vagaTitulo: c.vagaTitulo,
        participantName,
        receiverId,
        lastMessage: lastMsg?.text ?? "Clique para abrir conversa",
        lastMessageAt: formatTimestamp(lastMsg?.timestamp ?? ""),
      }
    })

  const uniqueByVaga = Array.from(
    new Map(conversations.map((c) => [c.vagaId, c])).values()
  )

  return (
    <div className="flex flex-col gap-4 pb-24 px-4 pt-2">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">Suas</span>
        <h1 className="text-2xl font-bold text-foreground">Mensagens</h1>
      </div>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : uniqueByVaga.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Nenhuma conversa ainda. Candidate-se a uma vaga para iniciar uma conversa.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {uniqueByVaga.map((conv) => (
            <button
              key={conv.vagaId}
              onClick={() => onOpenChat(conv.vagaId, conv.participantName, { vagaTitulo: conv.vagaTitulo, receiverId: conv.receiverId })}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-bold text-primary">
                  {conv.participantName?.charAt(0) || "?"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground truncate">
                    {conv.participantName}
                  </span>
                  {conv.lastMessageAt && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {conv.lastMessageAt}
                    </span>
                  )}
                </div>
                <span className="text-xs text-primary font-medium">{conv.vagaTitulo}</span>
                <span className="text-sm truncate text-muted-foreground">
                  {conv.lastMessage}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
