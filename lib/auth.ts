import { createClient } from "@/lib/supabase/client"

export async function signUp(
  email: string,
  password: string,
  role: "candidato" | "contratante",
  meta?: { name?: string; phone?: string }
) {
  const supabase = createClient()
  const name = meta?.name || email.split("@")[0]

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      data: {
        role,
        name,
        phone: meta?.phone,
      },
    },
  })

  return { data, error }
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  return { data, error }
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getProfile(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  return { data, error }
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  return { data, error }
}
