"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import EnhancedClassRadar from "@/components/enhanced-class-radar"
import StudentDrillDown from "@/components/student-drill-down"
import OverridePanel from "@/components/override-panel"
import AuditLogViewer from "@/components/audit-log-viewer"
import { Menu } from "lucide-react"

type DashboardViewContextType = {
  activeView: string
  setActiveView: (view: string) => void
  toggleSidebar: () => void
}

const DashboardViewContext = createContext<DashboardViewContextType | undefined>(undefined)

export function useDashboardView() {
  const context = useContext(DashboardViewContext)
  if (!context) {
    throw new Error("useDashboardView must be used within a DashboardViewProvider")
  }
  return context
}

export function DashboardViewProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState("class-radar")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <DashboardViewContext.Provider value={{ activeView, setActiveView, toggleSidebar }}>
      {children}
    </DashboardViewContext.Provider>
  )
}

export default function HomePage() {
  const { activeView, toggleSidebar } = useDashboardView()

  const renderView = () => {
    switch (activeView) {
      case "class-radar":
        return <EnhancedClassRadar />
      case "student-drill-down":
        return <StudentDrillDown />
      case "override-panel":
        return <OverridePanel />
      case "audit-log-viewer":
        return <AuditLogViewer />
      default:
        return <EnhancedClassRadar />
    }
  }

  return (
    <>
      <div className="dashboard-header">
        <button onClick={toggleSidebar} className="button outline">
          <Menu size={20} />
        </button>
        <h1>K-12 LLM Tutor Dashboard</h1>
      </div>
      <div className="p-20 flex-col flex-1 overflow-auto">{renderView()}</div>
    </>
  )
}
