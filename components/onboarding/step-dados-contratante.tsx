"use client"

import { useState } from "react"
import { User, Building, Mail, Phone } from "lucide-react"
import { useAppStore } from "@/lib/store"

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function StepDadosContratante() {
  const { currentUser, updateProfile } = useAppStore()
  const [nome, setNome] = useState(currentUser?.name || "")
  const [empresa, setEmpresa] = useState(currentUser?.empresa || "")
  const [cpf, setCpf] = useState(currentUser?.cpf || "")
  const [cnpj, setCnpj] = useState(currentUser?.cnpj || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [phone, setPhone] = useState(currentUser?.phone || currentUser?.whatsapp || "")

  const isPF = currentUser?.contratanteTipo === "pf"

  if (isPF) {
    return (
      <div className="flex flex-col gap-6 px-4 pb-32">
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
            <User className="h-7 w-7 text-warning" />
          </div>
          <h2 className="text-xl font-bold text-foreground text-balance text-center">
            Seus dados (Pessoa Fisica)
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Preencha corretamente para contratar diarias
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">Nome completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value)
                  updateProfile({ name: e.target.value })
                }}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => {
                const v = formatCPF(e.target.value)
                setCpf(v)
                updateProfile({ cpf: v })
              }}
              maxLength={14}
              className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  updateProfile({ email: e.target.value })
                }}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">Telefone / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                placeholder="(00) 90000-0000"
                value={phone}
                onChange={(e) => {
                  const v = formatPhone(e.target.value)
                  setPhone(v)
                  updateProfile({ phone: v, whatsapp: v })
                }}
                maxLength={15}
                className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-32">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
          <Building className="h-7 w-7 text-warning" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Dados da empresa (Pessoa Juridica)
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Razao social e CNPJ do estabelecimento
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground">Razao social / Nome da empresa</label>
          <div className="relative">
            <Building className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ex: Empresa XYZ Ltda"
            value={empresa}
            onChange={(e) => {
              setEmpresa(e.target.value)
              updateProfile({ empresa: e.target.value })
            }}
              className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground">CNPJ</label>
          <input
            type="text"
            placeholder="00.000.000/0001-00"
            value={cnpj}
            onChange={(e) => {
              const v = formatCNPJ(e.target.value)
              setCnpj(v)
              updateProfile({ cnpj: v })
            }}
            maxLength={18}
            className="h-14 rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground">E-mail de contato</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder="contato@empresa.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              updateProfile({ email: e.target.value })
            }}
              className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground">Telefone / WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="tel"
              placeholder="(00) 90000-0000"
              value={phone}
              onChange={(e) => {
                const v = formatPhone(e.target.value)
                setPhone(v)
                updateProfile({ phone: v, whatsapp: v })
              }}
              maxLength={15}
              className="h-14 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
