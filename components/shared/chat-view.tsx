"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip, Briefcase } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useMessages, createMessage } from "@/lib/hooks"

interface ChatViewProps {
  vagaId: string
  participantName?: string
  vagaTitulo?: string
  receiverId?: string
  onBack: () => void
  quickActions?: string[]
}

export function ChatView({ vagaId, participantName, vagaTitulo, receiverId, onBack, quickActions }: ChatViewProps) {
  const { currentUser } = useAppStore()
  const { messages, mutate } = useMessages(vagaId)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const defaultQuickActions = quickActions || [
    "Confirmo presenca",
    "Tenho duvida",
    "Estou a caminho",
  ]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return

    setSending(true)
    const res = await createMessage({
      vagaId,
      receiverId: receiverId ?? "",
      text: msg,
      isQuickAction: !!text,
    })
    setSending(false)
    if (res?.id) {
      mutate()
    }
    if (!text) setInput("")
  }

  const displayName = participantName || "Contratante"
  const title = vagaTitulo || "Vaga"

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
            <span className="text-sm font-bold text-primary">{displayName.charAt(0)}</span>
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate">{displayName}</span>
            <span className="text-xs text-primary font-medium truncate">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 pb-2">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <Briefcase className="h-3 w-3 text-primary" />
            <span className="text-[11px] font-semibold text-primary">{title}</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg: { id: string; senderId: string; text: string; timestamp: string }) => {
            const ts = typeof msg.timestamp === "string" && msg.timestamp.includes("T")
              ? new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
              : msg.timestamp
            const isMe = msg.senderId === currentUser?.id
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] mt-1 block text-right ${
                    isMe ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}>
                    {ts}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
        {defaultQuickActions.map((action) => (
          <button
            key={action}
            onClick={() => handleSend(action)}
            disabled={sending}
            className="shrink-0 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary active:bg-primary/10 disabled:opacity-50"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 pb-[env(safe-area-inset-bottom)] pt-3">
        <div className="mx-auto flex max-w-lg items-center gap-2 pb-2">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-muted">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
            className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary disabled:opacity-40 active:opacity-80"
          >
            <Send className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
