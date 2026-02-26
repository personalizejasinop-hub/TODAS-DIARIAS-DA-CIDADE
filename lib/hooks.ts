import useSWR from "swr"
import type { Vaga } from "@/lib/types"

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" })
    .then((r) => r.json())
    .then((body) => {
      if (body && typeof body === "object" && "error" in body) throw new Error(String(body.error))
      return body
    })

function ensureArray<T>(val: unknown): T[] {
  return Array.isArray(val) ? val : []
}

export function useVagas() {
  const { data, error, isLoading, mutate } = useSWR("/api/vagas", fetcher)
  return {
    vagas: ensureArray<Vaga>(data),
    isLoading,
    error,
    mutate,
  }
}

export function useCandidaturas(vagaId?: string | null) {
  const url = vagaId ? `/api/candidaturas?vagaId=${vagaId}` : "/api/candidaturas"
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  return {
    candidaturas: ensureArray(data),
    isLoading,
    error,
    mutate,
  }
}

export function useMessages(vagaId?: string | null) {
  const url = vagaId ? `/api/messages?vagaId=${vagaId}` : "/api/messages"
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  return {
    messages: ensureArray(data),
    isLoading,
    error,
    mutate,
  }
}

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR("/api/profiles", fetcher)
  return {
    profile: data ?? null,
    isLoading,
    error,
    mutate,
  }
}

export async function createVaga(vagaData: any) {
  const res = await fetch("/api/vagas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vagaData),
  })
  return res.json()
}

export async function createCandidatura(candidaturaData: any) {
  const res = await fetch("/api/candidaturas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidaturaData),
  })
  return res.json()
}

export async function createMessage(messageData: any) {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  })
  return res.json()
}

export async function updateProfile(profileData: any) {
  const res = await fetch("/api/profiles", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
    credentials: "include",
  })
  const data = await res.json()
  if (!res.ok) return { error: data.error ?? res.statusText }
  return data
}
