import type React from "react"
import { cookies } from "next/headers"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DashboardViewProvider } from "@/app/page"
import { PlainSidebar } from "@/components/plain-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "K-12 LLM Tutor Dashboard",
  description: "HIPAA-Inspired Explainable Dashboard for K-12 LLM Tutors",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true" // Still using cookie for sidebar state

  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardViewProvider>
          <div className="dashboard-container">
            <PlainSidebar defaultOpen={defaultOpen} />
            <div className="main-content-area">{children}</div>
          </div>
        </DashboardViewProvider>
      </body>
    </html>
  )
}
