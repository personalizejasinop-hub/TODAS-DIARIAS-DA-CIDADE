import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  OnboardingData,
  EscolaridadeOption,
  InteresseOption,
  DisponibilidadeOption,
  HorasOption,
  TransporteOption,
  UserProfile,
  DiariasCategory,
} from "./types"
import { DIARIAS_CATEGORIES } from "./data"

interface AppState {
  // Auth
  currentUser: UserProfile | null
  isLoggedIn: boolean

  // Onboarding
  onboardingStep: number
  onboardingData: OnboardingData

  // Admin
  diariasCategories: DiariasCategory[]

  // Actions - Auth
  logout: () => void
  switchMode: () => void
  setUserFromProfile: (profile: Record<string, unknown>) => void

  // Actions - Onboarding
  setOnboardingStep: (step: number) => void
  setEscolaridade: (value: EscolaridadeOption) => void
  setInteresse: (value: InteresseOption) => void
  setWhatsapp: (value: string) => void
  toggleDiaria: (id: string) => void
  selectAllInCategory: (categoryId: string) => void
  deselectAllInCategory: (categoryId: string) => void
  selectAllDiarias: () => void
  deselectAllDiarias: () => void
  toggleDisponibilidade: (value: DisponibilidadeOption) => void
  setHorasPorSemana: (value: HorasOption) => void
  setTransporte: (value: TransporteOption) => void
  completeOnboarding: () => void

  // Actions - Profile edit
  updateProfile: (data: Partial<OnboardingData>) => void

  // Actions - Admin
  toggleDiariaActive: (categoryId: string, itemId: string) => void
  addDiariaItem: (categoryId: string, label: string, customId?: string) => void
  reorderCategory: (categoryId: string, direction: "up" | "down") => void
  addCategory: (name: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoggedIn: false,
      onboardingStep: 1,
      onboardingData: {
        diariasSelecionadas: [],
        disponibilidade: [],
      },
      diariasCategories: DIARIAS_CATEGORIES,

      logout: () =>
        set({
          isLoggedIn: false,
          currentUser: null,
          onboardingStep: 1,
          onboardingData: {
            diariasSelecionadas: [],
            disponibilidade: [],
          },
        }),

      switchMode: () =>
        set((state) => {
          if (!state.currentUser || state.currentUser.role === "admin") return state
          const newRole = state.currentUser.role === "candidato" ? "contratante" : "candidato"
          return {
            currentUser: {
              ...state.currentUser,
              role: newRole as "candidato" | "contratante",
              activeMode: newRole as "candidato" | "contratante",
            },
          }
        }),

      setUserFromProfile: (profile) =>
        set({
          isLoggedIn: true,
          currentUser: {
            id: String(profile.id),
            name: String(profile.name ?? ""),
            email: String(profile.email ?? ""),
            phone: profile.phone as string | undefined,
            whatsapp: (profile.whatsapp ?? profile.phone) as string | undefined,
            photoUrl: profile.photoUrl as string | undefined,
            role: (profile.role as "candidato" | "contratante" | "admin") ?? "candidato",
            activeMode: profile.activeMode as "candidato" | "contratante" | undefined,
            onboardingComplete: Boolean(profile.onboardingComplete),
            escolaridade: profile.escolaridade as UserProfile["escolaridade"],
            interesse: profile.interesse as UserProfile["interesse"],
            diariasSelecionadas: (profile.diariasSelecionadas as string[]) ?? [],
            disponibilidade: (profile.disponibilidade as UserProfile["disponibilidade"]) ?? [],
            horasPorSemana: profile.horasPorSemana as UserProfile["horasPorSemana"],
            transporte: profile.transporte as UserProfile["transporte"],
            cep: profile.cep as string | undefined,
            endereco: profile.endereco as string | undefined,
            cpf: profile.cpf as string | undefined,
            cnpj: profile.cnpj as string | undefined,
            empresa: profile.empresa as string | undefined,
            contratanteTipo: profile.contratanteTipo as UserProfile["contratanteTipo"],
            raioBusca: profile.raioBusca as number | undefined,
            bloquearForaRaio: profile.bloquearForaRaio as boolean | undefined,
            scoreAgilidade: profile.scoreAgilidade as number | undefined,
            avaliacaoMedia: profile.avaliacaoMedia as number | undefined,
            totalAvaliacoes: profile.totalAvaliacoes as number | undefined,
            createdAt: String(profile.createdAt ?? profile.created_at ?? new Date().toISOString()),
          },
        }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      setEscolaridade: (value) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, escolaridade: value },
        })),

      setInteresse: (value) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, interesse: value },
        })),

      setWhatsapp: (value) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, whatsapp: value },
        })),

      toggleDiaria: (id) =>
        set((state) => {
          const current = state.onboardingData.diariasSelecionadas
          const updated = current.includes(id)
            ? current.filter((d) => d !== id)
            : [...current, id]
          return {
            onboardingData: { ...state.onboardingData, diariasSelecionadas: updated },
          }
        }),

      selectAllInCategory: (categoryId) =>
        set((state) => {
          const category = state.diariasCategories.find((c) => c.id === categoryId)
          if (!category) return state
          const categoryItemIds = category.items.filter((i) => i.active).map((i) => i.id)
          const current = state.onboardingData.diariasSelecionadas
          const updated = [...new Set([...current, ...categoryItemIds])]
          return {
            onboardingData: { ...state.onboardingData, diariasSelecionadas: updated },
          }
        }),

      deselectAllInCategory: (categoryId) =>
        set((state) => {
          const category = state.diariasCategories.find((c) => c.id === categoryId)
          if (!category) return state
          const categoryItemIds = category.items.map((i) => i.id)
          const updated = state.onboardingData.diariasSelecionadas.filter(
            (id) => !categoryItemIds.includes(id)
          )
          return {
            onboardingData: { ...state.onboardingData, diariasSelecionadas: updated },
          }
        }),

      selectAllDiarias: () =>
        set((state) => {
          const allIds = state.diariasCategories.flatMap((c) =>
            c.items.filter((i) => i.active).map((i) => i.id)
          )
          return {
            onboardingData: { ...state.onboardingData, diariasSelecionadas: allIds },
          }
        }),

      deselectAllDiarias: () =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, diariasSelecionadas: [] },
        })),

      toggleDisponibilidade: (value) =>
        set((state) => {
          const current = state.onboardingData.disponibilidade
          const updated = current.includes(value)
            ? current.filter((d) => d !== value)
            : [...current, value]
          return {
            onboardingData: { ...state.onboardingData, disponibilidade: updated },
          }
        }),

      setHorasPorSemana: (value) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, horasPorSemana: value },
        })),

      setTransporte: (value) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, transporte: value },
        })),

      completeOnboarding: () =>
        set((state) => {
          if (!state.currentUser) return state
          return {
            currentUser: {
              ...state.currentUser,
              onboardingComplete: true,
              escolaridade: state.onboardingData.escolaridade,
              interesse: state.onboardingData.interesse,
              whatsapp: state.onboardingData.whatsapp,
              diariasSelecionadas: state.onboardingData.diariasSelecionadas,
              disponibilidade: state.onboardingData.disponibilidade,
              horasPorSemana: state.onboardingData.horasPorSemana,
              transporte: state.onboardingData.transporte,
            },
          }
        }),

      updateProfile: (data) =>
        set((state) => {
          if (!state.currentUser) return state
          return {
            currentUser: {
              ...state.currentUser,
              ...data,
            },
            onboardingData: {
              ...state.onboardingData,
              ...data,
            },
          }
        }),

      // Admin actions
      toggleDiariaActive: (categoryId, itemId) =>
        set((state) => ({
          diariasCategories: state.diariasCategories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  items: cat.items.map((item) =>
                    item.id === itemId ? { ...item, active: !item.active } : item
                  ),
                }
              : cat
          ),
        })),

      addDiariaItem: (categoryId, label, customId) =>
        set((state) => ({
          diariasCategories: state.diariasCategories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  items: [
                    ...cat.items,
                    {
                      id: customId ?? `${categoryId}-${Date.now()}`,
                      label,
                      active: false,
                    },
                  ],
                }
              : cat
          ),
        })),

      reorderCategory: (categoryId, direction) =>
        set((state) => {
          const cats = [...state.diariasCategories]
          const index = cats.findIndex((c) => c.id === categoryId)
          if (index === -1) return state
          const newIndex = direction === "up" ? index - 1 : index + 1
          if (newIndex < 0 || newIndex >= cats.length) return state
          ;[cats[index], cats[newIndex]] = [cats[newIndex], cats[index]]
          return { diariasCategories: cats }
        }),

      addCategory: (name) =>
        set((state) => ({
          diariasCategories: [
            ...state.diariasCategories,
            {
              id: `cat-${Date.now()}`,
              name,
              icon: "category",
              items: [],
            },
          ],
        })),
    }),
    {
      name: "diarias-app-storage",
    }
  )
)
