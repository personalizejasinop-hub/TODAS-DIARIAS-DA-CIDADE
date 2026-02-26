"use client"

import { useState } from "react"
import { X, Star, Send } from "lucide-react"

interface AvaliacaoModalProps {
  nomeAvaliado: string
  tipo: "candidato" | "contratante"
  onClose: () => void
  onSubmit: (nota: number, comentario: string, tags: string[]) => void
}

const CANDIDATO_TAGS = ["Pontual", "Caprichoso", "Boa comunicacao", "Proativo", "Faltou"]
const CONTRATANTE_TAGS = ["Pagou certinho", "Educado", "Organizado", "Local ok", "Atrasou"]

export function AvaliacaoModal({ nomeAvaliado, tipo, onClose, onSubmit }: AvaliacaoModalProps) {
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tags = tipo === "candidato" ? CANDIDATO_TAGS : CONTRATANTE_TAGS

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 rounded-t-3xl bg-card max-h-[85dvh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-4 rounded-t-3xl">
          <h2 className="text-lg font-bold text-foreground">Avaliar {tipo === "candidato" ? "candidato" : "contratante"}</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full active:bg-muted">
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg font-bold text-primary">{nomeAvaliado.charAt(0)}</span>
            </div>
            <span className="text-base font-bold text-foreground">{nomeAvaliado}</span>
          </div>

          {/* Stars */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Qual sua nota?</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setNota(n)} className="active:scale-110 transition-transform">
                  <Star
                    className={`h-10 w-10 ${n <= nota ? "fill-warning text-warning" : "text-muted"}`}
                  />
                </button>
              ))}
            </div>
            {nota > 0 && (
              <span className="text-sm font-bold text-foreground">
                {nota === 5 ? "Excelente!" : nota === 4 ? "Muito bom" : nota === 3 ? "Bom" : nota === 2 ? "Regular" : "Ruim"}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-foreground">Tags (opcional)</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all active:scale-95 ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-foreground">Comentario (opcional)</span>
            <textarea
              placeholder="Como foi sua experiencia?"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
              className="rounded-xl border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <button
            onClick={() => onSubmit(nota, comentario, selectedTags)}
            disabled={nota === 0}
            className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground active:scale-[0.97] disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
            Enviar avaliacao
          </button>
        </div>
      </div>
    </div>
  )
}
