"use client"

import { LogIn } from "lucide-react"
import { login } from "@/lib/actions"

export default function LoginPage() {
  // const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="flex-col flex-1 overflow-auto p-20 flex-container items-center justify-center min-h-screen">
      <div className="card p-20 text-center space-y-6 w-full max-w-lg">
        <h1 className="text-2xl font-semibold">Login to LLM Tutor Dashboard</h1>
        <p className="text-muted">
          Select a role to simulate login and access the dashboard with corresponding permissions.
        </p>
        <form action={login} className="space-y-4">
          <button
            type="submit"
            name="role"
            value="teacher"
            className="button primary w-full flex-container items-center justify-center"
          >
            <LogIn size={16} className="mr-10" />
            Login as Teacher
          </button>
          <button
            type="submit"
            name="role"
            value="administrator"
            className="button primary w-full flex-container items-center justify-center"
          >
            <LogIn size={16} className="mr-10" />
            Login as Administrator
          </button>
          <button
            type="submit"
            name="role"
            value="dpo"
            className="button primary w-full flex-container items-center justify-center"
          >
            <LogIn size={16} className="mr-10" />
            Login as DPO
          </button>
        </form>
        {/* {state?.message && <p className="text-red-500 text-sm mt-4">{state.message}</p>} */}
        <p className="text-sm text-muted mt-4">This is a simulated login for demonstration purposes.</p>
      </div>
    </div>
  )
}
