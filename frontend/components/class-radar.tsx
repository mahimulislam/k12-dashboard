"use client"

import { Info } from "lucide-react"

export default function ClassRadar() {
  const misconceptions = [
    { topic: "Algebra", concept: "Solving Linear Equations", uncertainty: "high", students: 15 },
    { topic: "Geometry", concept: "Area of Triangles", uncertainty: "medium", students: 8 },
    { topic: "Calculus", concept: "Derivatives", uncertainty: "low", students: 3 },
    { topic: "Algebra", concept: "Factoring Quadratics", uncertainty: "high", students: 12 },
    { topic: "Statistics", concept: "Probability", uncertainty: "medium", students: 7 },
    { topic: "Geometry", concept: "Pythagorean Theorem", uncertainty: "low", students: 2 },
    { topic: "Algebra", concept: "Systems of Equations", uncertainty: "high", students: 10 },
    { topic: "Calculus", concept: "Integrals", uncertainty: "medium", students: 5 },
  ]

  const getUncertaintyClass = (uncertainty: string) => {
    switch (uncertainty) {
      case "high":
        return "border-red-500 shadow-red-200"
      case "medium":
        return "border-yellow-500 shadow-yellow-200"
      case "low":
        return "border-green-500 shadow-green-200"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Class Radar: Misconception Heat Map</h2>
      <p className="text-muted">
        Visual representation of common misconceptions across topics, with uncertainty halos indicating the model&apos;s
        confidence.
      </p>

      <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {misconceptions.map((item, index) => (
          <div key={index} className={`card border-2 ${getUncertaintyClass(item.uncertainty)} cursor-pointer`}>
            <div className="card-header">
              <div className="card-title flex-container justify-between items-center text-lg">
                {item.concept}
                <Info size={16} className="text-muted" />
              </div>
            </div>
            <div className="card-content">
              <p className="text-sm text-muted">{item.topic}</p>
              <p className="text-xl font-bold mt-10">{item.students} Students</p>
              <p className="text-xs text-muted mt-1">
                Uncertainty: <span className="font-medium capitalize">{item.uncertainty}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-muted">
        <h3 className="text-lg font-semibold mb-2">Legend: Uncertainty Halos</h3>
        <div className="flex-container flex-wrap gap-4">
          <div className="flex-container items-center gap-4">
            <span className="h-4 w-4 border-2 border-red-500 shadow-red-200 rounded-sm"></span>
            <span>High Uncertainty</span>
          </div>
          <div className="flex-container items-center gap-4">
            <span className="h-4 w-4 border-2 border-yellow-500 shadow-yellow-200 rounded-sm"></span>
            <span>Medium Uncertainty</span>
          </div>
          <div className="flex-container items-center gap-4">
            <span className="h-4 w-4 border-2 border-green-500 shadow-green-200 rounded-sm"></span>
            <span>Low Uncertainty</span>
          </div>
        </div>
      </div>
    </div>
  )
}
