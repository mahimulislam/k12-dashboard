"use client"

import { useState } from "react"
import { useDashboardView } from "@/app/page"
import { Home, GraduationCap, Settings, ScrollText, BarChart, ChevronDown, ChevronUp } from "lucide-react"

interface PlainSidebarProps {
  defaultOpen?: boolean
}

export function PlainSidebar({ defaultOpen = true }: PlainSidebarProps) {
  const { activeView, setActiveView } = useDashboardView()
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen)

  // This effect is to sync with the toggleSidebar from context, if needed
  // For this setup, the toggleSidebar in page.tsx will control the main-content-area's width
  // and this sidebar will control its own collapsed state.
  // For a fully integrated collapse, the sidebar state should be in the context.
  // For now, let's assume the toggle button in the header controls the main content area,
  // and this sidebar's collapse is independent or controlled by its own internal state.
  // Let's simplify and have the sidebar's collapse state managed here.

  const menuItems = [
    {
      title: "Class Radar",
      icon: BarChart,
      view: "class-radar",
    },
    {
      title: "Student Drill-Down",
      icon: GraduationCap,
      view: "student-drill-down",
    },
    {
      title: "Override Panel",
      icon: Settings,
      view: "override-panel",
    },
    {
      title: "Audit Log Viewer",
      icon: ScrollText,
      view: "audit-log-viewer",
    },
  ]

  return (
    <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div>
        <div className="sidebar-header">
          <button className="dropdown-trigger" onClick={() => setIsCollapsed(!isCollapsed)}>
            <Home size={20} />
            {!isCollapsed && <span>Dashboard</span>}
            {!isCollapsed &&
              (isCollapsed ? (
                <ChevronDown size={16} className="chevron" />
              ) : (
                <ChevronUp size={16} className="chevron" />
              ))}
          </button>
          {/* Dropdown menu functionality would need to be custom implemented with plain HTML/CSS/JS */}
        </div>
        <div className="sidebar-separator"></div>
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li className="sidebar-group-label">Views</li>
            {menuItems.map((item) => (
              <li key={item.view} className="sidebar-menu-item">
                <button
                  className={`sidebar-menu-button ${activeView === item.view ? "active" : ""}`}
                  onClick={() => setActiveView(item.view)}
                  title={item.title} // Tooltip functionality
                >
                  <item.icon size={20} />
                  {!isCollapsed && <span>{item.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sidebar-footer">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <button className="sidebar-menu-button">
              <div className="user-avatar">U</div>
              {!isCollapsed && <span>Teacher User</span>}
              {!isCollapsed && <ChevronUp size={16} className="chevron" />}
            </button>
            {/* Dropdown menu for user profile/sign out would also need custom implementation */}
          </li>
        </ul>
      </div>
    </nav>
  )
}
