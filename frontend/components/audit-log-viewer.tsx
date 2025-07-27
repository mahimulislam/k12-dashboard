"use client"

import { useState } from "react"

export default function AuditLogViewer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  const auditLogs = [
    {
      id: "log_001",
      timestamp: "2025-06-21 09:30:00",
      userId: "teacher_123",
      role: "Teacher",
      action: "Accessed Student Drill-Down for STU-4567",
      details: { studentId: "STU-4567", view: "Student Drill-Down" },
    },
    {
      id: "log_002",
      timestamp: "2025-06-21 10:15:30",
      userId: "admin_001",
      role: "Administrator",
      action: "Modified Override Panel: Hint Strictness to 70%",
      details: { panel: "Override Panel", setting: "Hint Strictness", oldValue: "50%", newValue: "70%" },
    },
    {
      id: "log_003",
      timestamp: "2025-06-21 11:00:10",
      userId: "teacher_123",
      role: "Teacher",
      action: "Viewed Class Radar",
      details: { view: "Class Radar" },
    },
    {
      id: "log_004",
      timestamp: "2025-06-21 11:45:00",
      userId: "dpo_001",
      role: "DPO",
      action: "Exported Audit Log Data",
      details: { format: "JSON", dateRange: "2025-06-01 to 2025-06-21" },
    },
    {
      id: "log_005",
      timestamp: "2025-06-21 13:20:05",
      userId: "teacher_456",
      role: "Teacher",
      action: "Accessed Student Drill-Down for STU-1234",
      details: { studentId: "STU-1234", view: "Student Drill-Down" },
    },
  ]

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || log.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">RBAC & Audit Log Viewer</h2>
      <p className="text-muted">
        View a comprehensive log of all user actions and system events, ensuring transparency and compliance.
      </p>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Audit Log Records</div>
          <div className="flex-container flex-col sm:flex-row gap-4 mt-4">
            <input
              type="text"
              placeholder="Search by action, user ID, or log ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ flex: 1 }}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="select-field"
              style={{ width: "180px" }}
            >
              <option value="all">All Roles</option>
              <option value="Teacher">Teacher</option>
              <option value="Administrator">Administrator</option>
              <option value="DPO">DPO</option>
            </select>
          </div>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>Log ID</th>
                  <th>Timestamp</th>
                  <th>User ID</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="font-medium">{log.id}</td>
                      <td>{log.timestamp}</td>
                      <td>{log.userId}</td>
                      <td>{log.role}</td>
                      <td>{log.action}</td>
                      <td className="text-xs">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="h-24 text-center text-muted">
                      No logs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
