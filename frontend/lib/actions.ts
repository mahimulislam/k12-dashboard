"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Mock user roles and their corresponding tokens
const MOCK_TOKENS: { [key: string]: string } = {
  teacher: "teacher_123",
  administrator: "admin_001",
  dpo: "dpo_001",
}

export async function login(...args: any[]) {
  // Support both call signatures:
  // (formData)  OR  (prevState, formData)
  const formData: FormData | undefined = args[0] instanceof FormData ? args[0] : args[1]

  if (!formData) {
    return { success: false, message: "No form data submitted." }
  }

  const role = String(formData.get("role") ?? "").trim()
  if (!role || !(role in MOCK_TOKENS)) {
    return { success: false, message: "Invalid role selected." }
  }

  const token = MOCK_TOKENS[role]
  if (!token) {
    console.error(`Attempted to log in with unknown role: ${role}`)
    return { success: false, message: "Invalid role selected." }
  }

  // Set the authentication token in a secure, HTTP-only cookie
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure in production
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
  })

  console.log(`User logged in as ${role} with token: ${token}`)
  redirect("/") // Redirect to the dashboard after successful login
}

export async function logout() {
  // Delete the authentication token cookie
  cookies().delete("auth_token")
  console.log("User logged out.")
  redirect("/login") // Redirect to the login page after logout
}

export async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get("auth_token")?.value
}
