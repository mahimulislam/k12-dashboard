"use client"

import { useState, useEffect } from "react"
import { Info, RefreshCw, Filter } from "lucide-react"

interface RadarDataItem {
  topic: string
  concept: string
  uncertainty: "high" | "medium" | "low"
  students: number
  avg_score: number
  min_score?: number
  max_score?: number
}

interface ApiResponse {
  data: RadarDataItem[]
  user_role: string
  permissions: string[]
  timestamp: string
}

export default function EnhancedClassRadar() {
  const [radarData, setRadarData] = useState<RadarDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>("")
  const [filterTopic, setFilterTopic] = useState<string>("all")
  const [filterUncertainty, setFilterUncertainty] = useState<string>("all")

  // Mock authentication token (in production, this would come from auth context)
  const [authToken] = useState("teacher_123") // Change to test different roles

  const fetchRadarData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/api/class-radar", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse = await response.json()
      setRadarData(result.data)
      setUserRole(result.user_role)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      // Fallback to mock data for demo
      setRadarData([
        { topic: "Algebra", concept: "Solving Linear Equations", uncertainty: "high", students: 15, avg_score: 65.2 },
        { topic: "Geometry", concept: "Area of Triangles", uncertainty: "medium", students: 8, avg_score: 78.5 },
        { topic: "Calculus", concept: "Derivatives", uncertainty: "low", students: 3, avg_score: 92.1 },
        { topic: "Algebra", concept: "Factoring Quadratics", uncertainty: "high", students: 12, avg_score: 58.7 },
        { topic: "Statistics", concept: "Probability", uncertainty: "medium", students: 7, avg_score: 71.3 },
        { topic: "Geometry", concept: "Pythagorean Theorem", uncertainty: "low", students: 2, avg_score: 89.0 },
      ])
      setUserRole("teacher")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRadarData()
  }, [authToken])

  const getUncertaintyClass = (uncertainty: string) => {
    switch (uncertainty) {
      case "high":
        return "border-red-500 shadow-red-200 bg-red-50"
      case "medium":
        return "border-yellow-500 shadow-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-500 shadow-green-200 bg-green-50"
      default:
        return ""
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Filter data based on selected filters
  const filteredData = radarData.filter((item) => {
    const topicMatch = filterTopic === "all" || item.topic === filterTopic
    const uncertaintyMatch = filterUncertainty === "all" || item.uncertainty === filterUncertainty
    return topicMatch && uncertaintyMatch
  })

  // Get unique topics for filter dropdown
  const uniqueTopics = Array.from(new Set(radarData.map((item) => item.topic)))

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Class Radar: Misconception Heat Map</h2>
        <div className="flex-container items-center justify-center p-20">
          <RefreshCw className="animate-spin mr-10" size={24} />
          <span>Loading radar data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex-container justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Class Radar: Misconception Heat Map</h2>
          <p className="text-muted">Real-time visualization of misconceptions with RBAC filtering (Role: {userRole})</p>
        </div>
        <button onClick={fetchRadarData} className="button outline flex-container items-center">
          <RefreshCw size={16} className="mr-10" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 border border-red-500 bg-red-50 rounded-md">
          <p className="text-red-700">⚠️ API Connection Error: {error}</p>
          <p className="text-sm text-red-600 mt-2">
            Showing fallback demo data. Start the RBAC API server to see live data.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <div className="card-title flex-container items-center">
            <Filter size={20} className="mr-10" />
            Filters
          </div>
        </div>
        <div className="card-content">
          <div className="flex-container gap-4">
            <div>
              <label className="label">Topic</label>
              <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="select-field">
                <option value="all">All Topics</option>
                {uniqueTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Uncertainty</label>
              <select
                value={filterUncertainty}
                onChange={(e) => setFilterUncertainty(e.target.value)}
                className="select-field"
              >
                <option value="all">All Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Grid */}
      <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className={`card border-2 ${getUncertaintyClass(item.uncertainty)} cursor-pointer hover:shadow-lg transition-shadow`}
          >
            <div className="card-header">
              <div className="card-title flex-container justify-between items-center text-lg">
                <span>{item.concept}</span>
                <Info size={16} className="text-muted" />
              </div>
            </div>
            <div className="card-content">
              <p className="text-sm text-muted mb-2">{item.topic}</p>

              <div className="flex-container justify-between items-center mb-2">
                <span className="text-xl font-bold">{item.students} Students</span>
                <span className={`text-lg font-semibold ${getScoreColor(item.avg_score)}`}>
                  {item.avg_score.toFixed(1)}%
                </span>
              </div>

              <div className="flex-container justify-between items-center text-xs text-muted">
                <span>
                  Uncertainty: <span className="font-medium capitalize">{item.uncertainty}</span>
                </span>
                {item.min_score !== undefined && item.max_score !== undefined && (
                  <span>
                    Range: {item.min_score}-{item.max_score}
                  </span>
                )}
              </div>

              {/* Progress bar showing average score */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.avg_score >= 80 ? "bg-green-500" : item.avg_score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${item.avg_score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center p-20 text-muted">No data matches the selected filters.</div>
      )}

      {/* Legend */}
      <div className="card bg-muted">
        <div className="card-header">
          <div className="card-title">Legend: Uncertainty Halos & RBAC Info</div>
        </div>
        <div className="card-content">
          <div className="grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Uncertainty Levels</h4>
              <div className="space-y-2">
                <div className="flex-container items-center gap-4">
                  <span className="h-4 w-4 border-2 border-red-500 bg-red-50 rounded-sm"></span>
                  <span>High Uncertainty (Model less confident)</span>
                </div>
                <div className="flex-container items-center gap-4">
                  <span className="h-4 w-4 border-2 border-yellow-500 bg-yellow-50 rounded-sm"></span>
                  <span>Medium Uncertainty</span>
                </div>
                <div className="flex-container items-center gap-4">
                  <span className="h-4 w-4 border-2 border-green-500 bg-green-50 rounded-sm"></span>
                  <span>Low Uncertainty (Model confident)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Your Access Level</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Role:</strong> {userRole}
                </p>
                <p>
                  <strong>Data View:</strong>{" "}
                  {userRole === "teacher" ? "Aggregated class data only" : "Full detailed access"}
                </p>
                <p>
                  <strong>Privacy:</strong> All student IDs are pseudonymized
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
