"use server"

import { signIn } from '@/lib/auth'

type LoginType = "github" | "google";

export async function handleRegister(provider: LoginType) {
  await signIn(provider, { redirectTo: "/dashboard" })
}