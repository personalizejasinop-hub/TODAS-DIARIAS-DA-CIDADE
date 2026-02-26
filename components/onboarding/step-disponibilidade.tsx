"use client"

import { Clock, Check, Car, Calendar, Sun } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { DIAS_SEMANA_OPTIONS, TURNOS_OPTIONS, HORAS_OPTIONS, TRANSPORTE_OPTIONS } from "@/lib/data"
import type { DisponibilidadeOption, HorasOption, TransporteOption } from "@/lib/types"

export function StepDisponibilidade() {
  const {
    onboardingData,
    toggleDisponibilidade,
    setHorasPorSemana,
    setTransporte,
  } = useAppStore()

  return (
    <div className="flex flex-col gap-8 px-4 pb-32">
      <div className="flex flex-col items-center gap-2 pt-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Clock className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground text-balance text-center">
          Disponibilidade
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Configure seus horarios e transporte
        </p>
      </div>

      {/* Dias da Semana */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Dias disponiveis</h3>
        </div>
        <p className="text-sm text-muted-foreground">Selecione os dias que voce pode trabalhar</p>
        <div className="grid grid-cols-7 gap-1.5">
          {DIAS_SEMANA_OPTIONS.map((option) => {
            const isSelected = onboardingData.disponibilidade.includes(
              option.value as DisponibilidadeOption
            )
            return (
              <button
                key={option.value}
                onClick={() =>
                  toggleDisponibilidade(option.value as DisponibilidadeOption)
                }
                className={`flex flex-col items-center justify-center rounded-xl border-2 py-3 transition-all active:scale-[0.93] ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <span className="text-xs font-bold">{option.label}</span>
              </button>
            )
          })}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              DIAS_SEMANA_OPTIONS.forEach((o) => {
                if (!onboardingData.disponibilidade.includes(o.value as DisponibilidadeOption)) {
                  toggleDisponibilidade(o.value as DisponibilidadeOption)
                }
              })
            }}
            className="flex-1 rounded-lg border border-primary/30 bg-primary/5 py-2 text-xs font-semibold text-primary active:scale-[0.97]"
          >
            Todos os dias
          </button>
          <button
            onClick={() => {
              const weekDays = ["segunda", "terca", "quarta", "quinta", "sexta"]
              weekDays.forEach((d) => {
                if (!onboardingData.disponibilidade.includes(d as DisponibilidadeOption)) {
                  toggleDisponibilidade(d as DisponibilidadeOption)
                }
              })
            }}
            className="flex-1 rounded-lg border border-border bg-card py-2 text-xs font-semibold text-foreground active:scale-[0.97]"
          >
            Seg a Sex
          </button>
          <button
            onClick={() => {
              const weekendDays = ["sabado", "domingo"]
              weekendDays.forEach((d) => {
                if (!onboardingData.disponibilidade.includes(d as DisponibilidadeOption)) {
                  toggleDisponibilidade(d as DisponibilidadeOption)
                }
              })
            }}
            className="flex-1 rounded-lg border border-border bg-card py-2 text-xs font-semibold text-foreground active:scale-[0.97]"
          >
            Fim de Semana
          </button>
        </div>
      </div>

      {/* Turnos */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Turnos disponiveis</h3>
        </div>
        <p className="text-sm text-muted-foreground">Quais turnos voce pode trabalhar?</p>
        <div className="flex flex-col gap-2">
          {TURNOS_OPTIONS.map((option) => {
            const isSelected = onboardingData.disponibilidade.includes(
              option.value as DisponibilidadeOption
            )
            return (
              <button
                key={option.value}
                onClick={() =>
                  toggleDisponibilidade(option.value as DisponibilidadeOption)
                }
                className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all active:scale-[0.98] ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <span
                  className={`text-base font-medium ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {option.label}
                </span>
                {isSelected && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Horas por semana */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-foreground">Horas por semana</h3>
        <p className="text-sm text-muted-foreground">Quantas horas voce toparia?</p>
        <div className="grid grid-cols-4 gap-2">
          {HORAS_OPTIONS.map((option) => {
            const isSelected = onboardingData.horasPorSemana === option.value
            return (
              <button
                key={option.value}
                onClick={() => setHorasPorSemana(option.value as HorasOption)}
                className={`flex h-14 items-center justify-center rounded-xl border-2 text-base font-bold transition-all active:scale-[0.95] ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Transporte */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Transporte proprio</h3>
        </div>
        <p className="text-sm text-muted-foreground">Voce tem transporte para extras?</p>
        <div className="grid grid-cols-2 gap-2">
          {TRANSPORTE_OPTIONS.map((option) => {
            const isSelected = onboardingData.transporte === option.value
            return (
              <button
                key={option.value}
                onClick={() => setTransporte(option.value as TransporteOption)}
                className={`flex h-14 items-center justify-center rounded-xl border-2 text-base font-medium transition-all active:scale-[0.95] ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
