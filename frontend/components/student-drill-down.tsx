"use client"

import { ArrowRight, MessageSquare, Lightbulb, CheckCircle } from "lucide-react"

export default function StudentDrillDown() {
  const studentName = "Alice Smith"
  const studentId = "STU-7890"

  const timelineEvents = [
    {
      id: 1,
      type: "tutor_interaction",
      timestamp: "2025-06-20 10:05 AM",
      title: "Asked for help on quadratic equations",
      description: "Student struggled with factoring x^2 - 5x + 6.",
      rationale:
        "SHAP: High importance on 'factoring' and 'negative coefficients'. Model suggested a step-by-step breakdown.",
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "tutor_hint",
      timestamp: "2025-06-20 10:10 AM",
      title: "Received hint on common factors",
      description: "Tutor provided a hint about finding two numbers that multiply to 6 and add to -5.",
      rationale:
        "SHAP: Hint was triggered by student's repeated incorrect attempts at finding factors. Model identified a pattern of 'multiplication' errors.",
      icon: Lightbulb,
    },
    {
      id: 3,
      type: "student_response",
      timestamp: "2025-06-20 10:15 AM",
      title: "Correctly factored the equation",
      description: "Student successfully factored (x-2)(x-3).",
      rationale:
        "SHAP: Positive contribution from 'correct answer' and 'previous hint application'. Mastery score increased for 'factoring'.",
      icon: CheckCircle,
    },
    {
      id: 4,
      type: "tutor_interaction",
      timestamp: "2025-06-20 10:20 AM",
      title: "Started new problem on linear inequalities",
      description: "Student initiated a new problem on 2x + 3 > 7.",
      rationale:
        "SHAP: Model identified 'linear equations' as a mastered concept, suggesting progression to 'inequalities'.",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Student Drill-Down: {studentName} ({studentId})
      </h2>
      <p className="text-muted">
        Detailed timeline of LLM tutor interactions, SHAP-based explanations, and mastery curve.
      </p>

      <div className="grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold">Tutor Interaction Timeline</h3>
          <div className="relative pl-6 border-l-2 border-muted">
            {timelineEvents.map((event) => (
              <div key={event.id} className="mb-6 relative">
                <div className="absolute -left-3 top-0 flex-container h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <event.icon size={16} />
                </div>
                <div className="card ml-4">
                  <div className="card-header">
                    <div className="card-title text-lg">{event.title}</div>
                    <p className="text-sm text-muted">{event.timestamp}</p>
                  </div>
                  <div className="card-content">
                    <p className="text-sm">{event.description}</p>
                    <div className="mt-3 p-3 bg-muted rounded-md text-xs">
                      <p className="font-medium">SHAP Rationale:</p>
                      <p>{event.rationale}</p>
                    </div>
                    <button className="button outline mt-3">
                      View Full Interaction <ArrowRight size={16} className="ml-auto mr-10" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-semibold">Mastery Curve (Placeholder)</h3>
          <div className="card">
            <div className="card-content p-4">
              <div
                className="h-48 w-full rounded-lg flex-container items-center justify-center text-sm text-muted"
                style={{ background: "linear-gradient(to right, #90EE90, #FFFF00, #FF6347)" }}
              >
                Graph showing mastery progression over time.
              </div>
              <p className="text-sm text-muted mt-2">
                This graph would dynamically update to show the student&apos;s mastery level for different concepts.
              </p>
            </div>
          </div>
          <div className="sidebar-separator"></div> {/* Reusing separator style */}
          <h3 className="text-xl font-semibold">Key Insights</h3>
          <div className="card">
            <div className="card-content p-4 text-sm space-y-6">
              <p>• Student shows strong progress in Algebra.</p>
              <p>• Needs more practice with advanced Geometry concepts.</p>
              <p>• Responds well to step-by-step hints.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
